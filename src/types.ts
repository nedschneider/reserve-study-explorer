export type Category =
  | "Roofing"
  | "Interior Furnishings"
  | "Equipment"
  | "Building Components"
  | "Grounds Components";

export const CATEGORIES: Category[] = [
  "Roofing",
  "Interior Furnishings",
  "Equipment",
  "Building Components",
  "Grounds Components",
];

export interface Component {
  id: number;
  description: string;
  building: string;
  category: Category;
  placedInServiceYear: number;
  usefulLife: number;
  /** Study "Adjustment" column — years the replacement has been pushed beyond PIS + UL. */
  adjustment: number;
  replacementYear: number;
  /** Actual/current cost in 2027 dollars. */
  actualCost: number;
}

export interface Scenario {
  /** Starting reserve balance, default 0. */
  seed: number;
  /** Annual contribution, default 0 (study's "current assessment" model). */
  annualContribution: number;
  /** Annual contribution increase %, default 4 (study param). */
  contributionIncreasePct: number;
  /** Interest rate on reserve deposits %, default 0 (study param). */
  interestRatePct: number;
  /** Inflation %, default 2 (study param). */
  inflationPct: number;
  /** Last year of the projection, default 2046 (study horizon). */
  horizonEndYear: number;
}

export interface YearResult {
  year: number;
  beginningBalance: number;
  contribution: number;
  interest: number;
  expenditures: number;
  expendituresByCategory: Record<Category, number>;
  expendituresByComponent: { id: number; description: string; amount: number; category: Category }[];
  endingBalance: number;
  fullyFunded: number;
  percentFunded: number;
}

export type SolveTarget =
  | { kind: "break-even" }
  | { kind: "fundedPercent"; pct: number };
