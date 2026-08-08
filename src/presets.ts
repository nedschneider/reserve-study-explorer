import type { Scenario } from "./types";
import { STUDY_DEFAULTS } from "./data/components";
import { solveContribution } from "./lib/simulate";
import { COMPONENTS } from "./data/components";

export interface Preset {
  id: string;
  label: string;
  blurb: string;
  build: () => Scenario;
}

/** A preset that solves for the break-even contribution (ending balance ≈ $0 at horizon end). */
function breakEvenPreset(): Scenario {
  const base: Scenario = { ...STUDY_DEFAULTS, horizonEndYear: 2046, contributionIncreasePct: 0 };
  const contribution = solveContribution(base, { kind: "break-even" }, COMPONENTS);
  return { ...base, annualContribution: contribution };
}

/** A preset that solves for the contribution reaching 100% funded by the horizon end. */
function fullyFundedPreset(): Scenario {
  const base: Scenario = { ...STUDY_DEFAULTS, horizonEndYear: 2046, contributionIncreasePct: 0 };
  const contribution = solveContribution(base, { kind: "fundedPercent", pct: 100 }, COMPONENTS);
  return { ...base, annualContribution: contribution };
}

export const PRESETS: Preset[] = [
  {
    id: "status-quo",
    label: "Status Quo",
    blurb: "The study's defaults. $0 start, no contributions.",
    build: () => ({ ...STUDY_DEFAULTS }),
  },
  {
    id: "break-even",
    label: "Break-Even",
    blurb: "Contribute just enough to end at $0 by 2046.",
    build: breakEvenPreset,
  },
  {
    id: "fully-funded",
    label: "Fully Funded",
    blurb: "Contribute enough to reach 100% funded by 2046.",
    build: fullyFundedPreset,
  },
  {
    id: "steady-saver",
    label: "Steady Saver",
    blurb: "$50k seed, $15k/yr, 3% raises, 4% interest, out to 2070.",
    build: () => ({
      ...STUDY_DEFAULTS,
      seed: 50000,
      annualContribution: 15000,
      contributionIncreasePct: 3,
      interestRatePct: 4,
      inflationPct: 2,
      horizonEndYear: 2070,
    }),
  },
  {
    id: "inflation-shock",
    label: "Inflation Shock",
    blurb: "4% inflation instead of 2%. Everything else unchanged.",
    build: () => ({ ...STUDY_DEFAULTS, inflationPct: 4 }),
  },
];
