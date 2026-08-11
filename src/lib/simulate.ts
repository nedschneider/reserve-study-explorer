import type {
  Component,
  Scenario,
  YearResult,
  SolveTarget,
  Category,
} from "../types";
import { BASE_YEAR, emptyCategoryMap } from "../data/components";

/**
 * Fully-funded reserve target for a year, computed via straight-line depreciation:
 * for each component, the fraction of its useful life consumed determines how much
 * of its future cost is already "accrued."
 */
export function fullyFundedForYear(
  components: Component[],
  year: number,
  inflationPct: number,
): number {
  let total = 0;
  for (const c of components) {
    const step = Math.max(1, c.usefulLife);
    let lastReplacement = c.replacementYear;
    while (lastReplacement + step <= year) {
      lastReplacement += step;
    }
    const effectivePIS = year >= c.replacementYear ? lastReplacement : c.placedInServiceYear;
    const adjustment = year >= c.replacementYear ? 0 : c.adjustment;
    const adjustedAge = Math.max(0, year - effectivePIS - adjustment);
    const fraction = Math.min(1, adjustedAge / step);
    total += futureCost(c.actualCost, inflationPct, year) * fraction;
  }
  return total;
}

/**
 * Compute the inflated cost of a component at a given occurrence year.
 * futureCost = actualCost × (1 + inflationPct/100) ^ (year − BASE_YEAR)
 */
export function futureCost(
  actualCost: number,
  inflationPct: number,
  occurrenceYear: number,
): number {
  const years = occurrenceYear - BASE_YEAR;
  if (years <= 0) return actualCost;
  const factor = Math.pow(1 + inflationPct / 100, years);
  return actualCost * factor;
}

/**
 * Years in [BASE_YEAR, horizonEnd] at which the component is replaced.
 * First replacement = replacementYear; subsequent = replacementYear + k × usefulLife.
 */
export function expenditureYears(
  component: Component,
  horizonEnd: number,
): number[] {
  const years: number[] = [];
  const step = Math.max(1, component.usefulLife);
  for (
    let y = component.replacementYear;
    y <= horizonEnd;
    y += step
  ) {
    if (y >= BASE_YEAR) years.push(y);
  }
  return years;
}

/** Map each occurrence year to the components replaced then. */
function buildSchedule(components: Component[], horizonEnd: number) {
  const byYear = new Map<number, Component[]>();
  for (const c of components) {
    for (const y of expenditureYears(c, horizonEnd)) {
      const list = byYear.get(y);
      if (list) list.push(c);
      else byYear.set(y, [c]);
    }
  }
  return byYear;
}

/** Run the full year-by-year simulation. */
export function simulate(scenario: Scenario, components: Component[]): YearResult[] {
  const { seed, annualContribution, contributionIncreasePct, interestRatePct, inflationPct, horizonEndYear } = scenario;
  const schedule = buildSchedule(components, horizonEndYear);
  const results: YearResult[] = [];
  let prevBalance = seed;

  for (let y = BASE_YEAR; y <= horizonEndYear; y++) {
    const beginningBalance = prevBalance;
    const contribution = annualContribution * Math.pow(1 + contributionIncreasePct / 100, y - BASE_YEAR);
    const interest = Math.max(0, beginningBalance) * (interestRatePct / 100);

    const dueThisYear = schedule.get(y) ?? [];
    const byCat: Record<Category, number> = emptyCategoryMap();
    const byComp: YearResult["expendituresByComponent"] = [];
    let expenditures = 0;
    for (const c of dueThisYear) {
      const amount = futureCost(c.actualCost, inflationPct, y);
      expenditures += amount;
      byCat[c.category] += amount;
      byComp.push({ id: c.id, description: c.description, building: c.building, amount, category: c.category });
    }

    const endingBalance = beginningBalance + contribution + interest - expenditures;
    const fullyFunded = fullyFundedForYear(components, y, inflationPct);
    const percentFunded = fullyFunded === 0 ? 0 : endingBalance / fullyFunded;

    results.push({
      year: y,
      beginningBalance,
      contribution,
      interest,
      expenditures,
      expendituresByCategory: byCat,
      expendituresByComponent: byComp,
      endingBalance,
      fullyFunded,
      percentFunded,
    });
    prevBalance = endingBalance;
  }
  return results;
}

/**
 * Binary-search the smallest annual contribution (with other levers held) that satisfies a target
 * measured at the **horizon-end year**.
 * - "break-even": ending balance at the horizon ≥ 0 (total contributions catch up to total expenses
 *   by the end; the reserve may dip negative mid-horizon, which is expected and realistic).
 * - "fundedPercent": percent-funded at the horizon end ≥ pct (e.g. 100 = reserve reaches the
 *   fully-funded target by the final year, not in year 1).
 *
 * Evaluating at the horizon end (not the minimum across all years) avoids the degenerate case where
 * a $0 start forces an enormous front-loaded contribution that then accumulates forever.
 *
 * Returns the contribution rounded to whole dollars.
 */
export function solveContribution(
  scenario: Scenario,
  target: SolveTarget,
  components: Component[],
): number {
  const meets = (results: YearResult[]): boolean => {
    const last = results[results.length - 1];
    if (target.kind === "break-even") {
      return last.endingBalance >= -0.5;
    }
    const threshold = target.pct / 100;
    return last.percentFunded >= threshold - 1e-9;
  };

  // Quick check: does 0 already satisfy?
  const atZero = simulate({ ...scenario, annualContribution: 0 }, components);
  if (meets(atZero)) return 0;

  // Find an upper bound where the target is met.
  let lo = 0;
  let hi = 1000;
  let guard = 0;
  while (guard < 40) {
    const res = simulate({ ...scenario, annualContribution: hi }, components);
    if (meets(res)) break;
    hi *= 2;
    guard++;
  }
  if (guard >= 40) return Math.round(hi);

  // Binary search for the smallest meeting contribution.
  while (hi - lo > 1) {
    const mid = (lo + hi) / 2;
    const res = simulate({ ...scenario, annualContribution: mid }, components);
    if (meets(res)) hi = mid;
    else lo = mid;
  }
  return Math.round(hi);
}
