import { describe, it, expect } from "vitest";
import {
  simulate,
  futureCost,
  expenditureYears,
  solveContribution,
} from "../src/lib/simulate";
import { COMPONENTS, STUDY_DEFAULTS, PUBLISHED_FIXTURES } from "../src/data/components";
import type { Scenario } from "../src/types";

const TOLERANCE = 1; // ±$1 rounding tolerance, per the study's whole-dollar rounding.

describe("futureCost", () => {
  it("matches the study's Future Cost for every component at its replacement year (2% inflation)", () => {
    const cases: [number, number][] = [
      [1285, 32806.46], // Boathouse Roof 28000 -> 2035
      [1265, 71412.31], // Septic 50000 -> 2045
      [1261, 66241.19], // Main House Window 30000 -> 2067
      [1284, 3514.98], // Icehouse Roof 3000 -> 2035
      [1273, 10819.99], // Main House Boiler 9800 -> 2032
      [1270, 2800.0], // Main House HW Heater 2800 -> 2027 (year 0)
    ];
    for (const [id, expected] of cases) {
      const c = COMPONENTS.find((x) => x.id === id)!;
      const got = futureCost(c.actualCost, 2, c.replacementYear);
      expect(got).toBeCloseTo(expected, 1);
    }
  });

  it("returns the actual cost when occurrence is the base year", () => {
    expect(futureCost(1000, 5, 2027)).toBe(1000);
  });
});

describe("expenditureYears", () => {
  it("lists the first replacement and recurs at the useful-life interval", () => {
    const mainHWH = COMPONENTS.find((c) => c.id === 1270)!; // repl 2027, UL 18
    expect(expenditureYears(mainHWH, 2070)).toEqual([2027, 2045, 2063]);
  });

  it("includes only years within the study horizon for the published rows", () => {
    const boiler = COMPONENTS.find((c) => c.id === 1273)!; // repl 2032, UL 30
    expect(expenditureYears(boiler, 2046)).toEqual([2032]);
  });

  it("does not list years before the base year", () => {
    const cabinSiding = COMPONENTS.find((c) => c.id === 1277)!; // repl 2028, UL 40
    expect(expenditureYears(cabinSiding, 2046)).toEqual([2028]);
  });
});

describe("simulate (default scenario reproduces the study)", () => {
  const results = simulate(STUDY_DEFAULTS, COMPONENTS);

  it("produces a row for every year 2027–2046", () => {
    expect(results).toHaveLength(20);
    expect(results[0].year).toBe(2027);
    expect(results[19].year).toBe(2046);
  });

  it.each(PUBLISHED_FIXTURES.map((f) => [f.year, f] as const))(
    "reproduces year %i expenditures, ending reserves, fully funded, and percent funded",
    (year, f) => {
      const r = results.find((x) => x.year === year)!;
      expect(r.expenditures).toBeCloseTo(f.expenditures, -1 * Math.ceil(-Math.log10(TOLERANCE + 1)));
      // Looser but clear: within $1.
      expect(Math.abs(r.expenditures - f.expenditures)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(r.endingBalance - f.endingReserves)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(r.fullyFunded - f.fullyFunded)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(r.percentFunded - f.percentFunded)).toBeLessThan(0.005);
    },
  );

  it("totals expenditures match the study's published totals each year", () => {
    for (const f of PUBLISHED_FIXTURES) {
      const r = results.find((x) => x.year === f.year)!;
      const byCatSum = Object.values(r.expendituresByCategory).reduce((a, b) => a + b, 0);
      expect(Math.abs(byCatSum - r.expenditures)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it("has a zero contribution and zero interest under study defaults", () => {
    for (const r of results) {
      expect(r.contribution).toBe(0);
      expect(r.interest).toBe(0);
    }
  });
});

describe("solveContribution", () => {
  const base: Scenario = { ...STUDY_DEFAULTS, horizonEndYear: 2046, contributionIncreasePct: 0 };

  it("returns 0 when the scenario already ends at or above $0", () => {
    const rich: Scenario = { ...base, seed: 5_000_000 };
    expect(solveContribution(rich, { kind: "break-even" }, COMPONENTS)).toBe(0);
  });

  it("finds a contribution whose ending balance at the horizon is ≥ 0", () => {
    const needed = solveContribution(base, { kind: "break-even" }, COMPONENTS);
    expect(needed).toBeGreaterThan(0);
    const results = simulate({ ...base, annualContribution: needed }, COMPONENTS);
    const ending = results[results.length - 1].endingBalance;
    expect(ending).toBeGreaterThanOrEqual(-0.5);
    // A dollar less should end below $0 (break-even is the boundary).
    const below = simulate({ ...base, annualContribution: needed - 1 }, COMPONENTS);
    const endingBelow = below[below.length - 1].endingBalance;
    expect(endingBelow).toBeLessThan(-0.5);
  });

  it("break-even contribution is close to total-expenses / years (≈ $16,795/yr)", () => {
    const needed = solveContribution(base, { kind: "break-even" }, COMPONENTS);
    const totalExp = PUBLISHED_FIXTURES.reduce((a, f) => a + f.expenditures, 0);
    const perYear = totalExp / 20;
    // Should be within a few dollars of the naive average.
    expect(Math.abs(needed - perYear)).toBeLessThan(5);
  });

  it("finds a contribution reaching 100% funded by the horizon end (not year 1)", () => {
    const needed = solveContribution(base, { kind: "fundedPercent", pct: 100 }, COMPONENTS);
    expect(needed).toBeGreaterThan(0);
    const results = simulate({ ...base, annualContribution: needed }, COMPONENTS);
    const finalPct = results[results.length - 1].percentFunded;
    expect(finalPct).toBeGreaterThanOrEqual(1 - 1e-6);
    // The final ending balance should be near the fully-funded target, not wildly above it.
    const ending = results[results.length - 1].endingBalance;
    const target = results[results.length - 1].fullyFunded;
    expect(ending).toBeLessThan(target + 100);
  });
});
