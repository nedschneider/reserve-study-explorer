import { describe, it, expect } from "vitest";
import {
  simulate,
  futureCost,
  expenditureYears,
  solveContribution,
} from "../src/lib/simulate";
import { COMPONENTS, STUDY_DEFAULTS, BASE_YEAR } from "../src/data/components";
import type { Scenario } from "../src/types";

const TOLERANCE = 1; // ±$1 rounding tolerance.

describe("futureCost", () => {
  it("returns the actual cost when occurrence is the base year", () => {
    expect(futureCost(1000, 5, BASE_YEAR)).toBe(1000);
  });

  it("inflates the cost for years after the base year", () => {
    // 28000 at year 2035 (8 years of 2% inflation): 28000 × 1.02^8
    expect(futureCost(28000, 2, 2035)).toBeCloseTo(28000 * Math.pow(1.02, 8), 1);
  });

  it("does not inflate for years before the base year", () => {
    expect(futureCost(1000, 5, 2020)).toBe(1000);
  });
});

describe("expenditureYears", () => {
  it("lists the first replacement and recurs at the useful-life interval", () => {
    const mainHWH = COMPONENTS.find((c) => c.id === 1270)!; // repl 2027, UL 18
    expect(expenditureYears(mainHWH, 2070)).toEqual([2027, 2045, 2063]);
  });

  it("includes only years within the horizon", () => {
    const boiler = COMPONENTS.find((c) => c.id === 1273)!; // repl 2032, UL 30
    expect(expenditureYears(boiler, 2046)).toEqual([2032]);
  });

  it("does not list years before the base year", () => {
    const cabinSiding = COMPONENTS.find((c) => c.id === 1277)!; // repl 2028, UL 40
    expect(expenditureYears(cabinSiding, 2046)).toEqual([2028]);
  });

  it("fires the main house and icehouse roofs in 2028", () => {
    const mainRoof = COMPONENTS.find((c) => c.id === 1271)!;
    expect(expenditureYears(mainRoof, 2046)).toEqual([2028]);
    const iceRoof = COMPONENTS.find((c) => c.id === 1284)!;
    expect(expenditureYears(iceRoof, 2046)).toEqual([2028]);
  });

  it("does not fire the zing house roof within the default horizon (repl 2054)", () => {
    const zingRoof = COMPONENTS.find((c) => c.id === 1288)!;
    expect(expenditureYears(zingRoof, 2046)).toEqual([]);
  });

  it("does not fire the main house siding within the default horizon (repl 2062)", () => {
    const siding = COMPONENTS.find((c) => c.id === 1272)!;
    expect(expenditureYears(siding, 2046)).toEqual([]);
  });

  it("fires the dock maintenance at 10-year intervals from 2030", () => {
    const dock = COMPONENTS.find((c) => c.id === 1289)!; // repl 2030, UL 10
    expect(expenditureYears(dock, 2046)).toEqual([2030, 2040]);
  });

  it("fires the driveway maintenance at 5-year intervals from 2029", () => {
    const driveway = COMPONENTS.find((c) => c.id === 1290)!; // repl 2029, UL 5
    expect(expenditureYears(driveway, 2046)).toEqual([2029, 2034, 2039, 2044]);
  });

  it("fires the tree work at 5-year intervals from 2032", () => {
    const treeWork = COMPONENTS.find((c) => c.id === 1291)!; // repl 2032, UL 5
    expect(expenditureYears(treeWork, 2046)).toEqual([2032, 2037, 2042]);
  });

  it("fires the cabin exterior paint at 5-year intervals from 2027", () => {
    const cabinPaint = COMPONENTS.find((c) => c.id === 1295)!; // repl 2027, UL 5
    expect(expenditureYears(cabinPaint, 2046)).toEqual([2027, 2032, 2037, 2042]);
  });

  it("fires the tennis court rehabilitation at 10-year intervals from 2029", () => {
    const tennis = COMPONENTS.find((c) => c.id === 1307)!; // repl 2029, UL 10
    expect(expenditureYears(tennis, 2046)).toEqual([2029, 2039]);
  });

  it("fires the woodshed roof in 2032", () => {
    const woodshed = COMPONENTS.find((c) => c.id === 1308)!; // repl 2032, UL 30
    expect(expenditureYears(woodshed, 2046)).toEqual([2032]);
  });
});

describe("simulate (structural properties)", () => {
  const results = simulate(STUDY_DEFAULTS, COMPONENTS);

  it("produces a row for every year 2027–2046", () => {
    expect(results).toHaveLength(20);
    expect(results[0].year).toBe(2027);
    expect(results[19].year).toBe(2046);
  });

  it("has a zero contribution and zero interest under study defaults", () => {
    for (const r of results) {
      expect(r.contribution).toBe(0);
      expect(r.interest).toBe(0);
    }
  });

  it("category sums match total expenditures each year", () => {
    for (const r of results) {
      const byCatSum = Object.values(r.expendituresByCategory).reduce((a, b) => a + b, 0);
      expect(Math.abs(byCatSum - r.expenditures)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it("component detail sums match total expenditures each year", () => {
    for (const r of results) {
      const byCompSum = r.expendituresByComponent.reduce((a, c) => a + c.amount, 0);
      expect(Math.abs(byCompSum - r.expenditures)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it("ending balance equals accumulated expenditures (no contributions/interest)", () => {
    let cumulative = 0;
    for (const r of results) {
      cumulative += r.expenditures;
      expect(Math.abs(r.endingBalance + cumulative)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it("has expenditures in 2028 for the moved-up roofs", () => {
    const r2028 = results.find((r) => r.year === 2028)!;
    expect(r2028.expendituresByCategory.Roofing).toBeGreaterThan(0);
  });

  it("still has roofing expenditures in 2035 (boathouse, cabin, cottage, studio)", () => {
    const r2035 = results.find((r) => r.year === 2035)!;
    expect(r2035.expendituresByCategory.Roofing).toBeGreaterThan(0);
  });

  it("does not fire the main house or icehouse roofs in 2035", () => {
    const r2035 = results.find((r) => r.year === 2035)!;
    const compIds = r2035.expendituresByComponent.map((c) => c.id);
    expect(compIds).not.toContain(1271); // Main House roof
    expect(compIds).not.toContain(1284); // Icehouse roof
  });

  it("has building-component expenditures in 2027 (boathouse siding + cabin paint)", () => {
    const r2027 = results.find((r) => r.year === 2027)!;
    expect(r2027.expendituresByCategory["Building Components"]).toBeGreaterThan(0);
    const compIds = r2027.expendituresByComponent.map((c) => c.id);
    expect(compIds).toContain(1299); // Boathouse siding
    expect(compIds).toContain(1295); // Cabin exterior paint
  });

  it("has grounds expenditures in 2029 (tennis court + driveway)", () => {
    const r2029 = results.find((r) => r.year === 2029)!;
    expect(r2029.expendituresByCategory["Grounds Components"]).toBeGreaterThan(0);
  });

  it("fires the dock maintenance in 2030", () => {
    const r2030 = results.find((r) => r.year === 2030)!;
    const dock = r2030.expendituresByComponent.find((c) => c.id === 1289);
    expect(dock).toBeDefined();
    expect(dock!.amount).toBeCloseTo(futureCost(50000, 2, 2030), 1);
  });

  it("has grounds expenditures in 2032 (tree work)", () => {
    const r2032 = results.find((r) => r.year === 2032)!;
    expect(r2032.expendituresByCategory["Grounds Components"]).toBeGreaterThan(0);
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

  it("break-even contribution is close to total-expenses / years", () => {
    const needed = solveContribution(base, { kind: "break-even" }, COMPONENTS);
    const results = simulate(base, COMPONENTS);
    const totalExp = results.reduce((a, r) => a + r.expenditures, 0);
    const perYear = totalExp / 20;
    // Should be within a few dollars of the naive average.
    expect(Math.abs(needed - perYear)).toBeLessThan(5);
  });

  it("finds a contribution reaching 100% funded by the horizon end", () => {
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
