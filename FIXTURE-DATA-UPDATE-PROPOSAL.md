# Fixture Data Update Proposal — Family Feedback

## Status

**Implemented.** All seven changes have been applied; the study-fidelity layer (`PUBLISHED_FIXTURES`
lookup table and study-reproduction tests) has been retired. Fully-funded reserves now compute
via straight-line depreciation. Tests rewritten to verify structural properties. See git history
for the implementing commit.

## Context

The app's `COMPONENTS` array (`src/data/components.ts`) is currently baked directly from the Michael Callahan & Associates reserve study dated June 18, 2026 (budget year Jan 1, 2027). The original PDF was excluded from the public GitHub repo for privacy. The app guarantees the default scenario reproduces the study's published 2027–2046 projection exactly, enforced by `PUBLISHED_FIXTURES` (a baked lookup table) and 32 unit tests in `tests/simulate.test.ts`.

The family has since provided corrections based on actual on-the-ground knowledge of the compound. These represent reality that the study (which was a desktop analysis) got wrong or missed.

## The feedback (verbatim)

> The Zing roof was repaired and replaced like three years ago. The main house siding I replaced / repaired over the last five years, it's good. The dock needs to be added on to this list. The spring ice out does major damage on average say once every ten years. Depending on the extent of the damage it might cost 50K$ to repair. We don't have eight years to replace the main house and ice house roofs more like one to three and the ridge lines are shot now. Another item to add like the dock is the driveway. That expense is shared with the neighbors but still is probably 5K every five years. Also a more difficult one to quantify is forestry work which covers things like driveway cuttings, trail cutting, firewood, tree disease. For example over the past year, I cut down three trees along the driveway that had fallen or were about to and every five years or so I use the power pruner to trim back the branches. A tree service company will have to be used for some of this in future years on an as needed basis, say 10K every five years.

## The core tension

The app currently guarantees that the default scenario reproduces the MCA study's published 2027–2046 projection exactly. This is enforced two ways:

1. **`PUBLISHED_FIXTURES`** (`src/data/components.ts:46-73`) — a baked lookup table of the study's published expenditures, ending reserves, fully-funded, and percent-funded for each year. Used both as a test gold-standard *and* as the `fullyFundedForYear` lookup (`src/lib/simulate.ts:18-28`).
2. **`tests/simulate.test.ts`** — 32 tests that verify `simulate(STUDY_DEFAULTS, COMPONENTS)` matches `PUBLISHED_FIXTURES` within ±$1.

Changing `COMPONENTS` breaks both. The feedback represents ground-truth corrections to the study, so the question is whether to maintain study fidelity alongside the corrections or depart from it.

## Recommended approach: Update in place, retire the study-fidelity layer

The app is a family planning tool ("family planning use only" per the footer), not an audit of the MCA study. The study was the starting point; the family is now providing reality. Maintaining a second parallel dataset adds complexity for no practical benefit. Recommended:

- **Update `COMPONENTS` directly** with the corrections and additions below.
- **Retire `PUBLISHED_FIXTURES`** as a test oracle and FF lookup. Keep it in the file as a commented historical reference if desired, but stop using it functionally.
- **Switch `fullyFundedForYear` to always compute from scratch** using the existing straight-line depreciation method (`src/lib/simulate.ts:31-44`). This already works for years >2046; extending it to all years is a one-line change (remove the `PUBLISHED_FF` lookup shortcut). The FF values will differ from the study's, which is expected and correct given the updated data.
- **Rewrite the tests** to verify structural properties of the new dataset (expenditure years are correct, category sums match totals, solve-contribution produces sane results) rather than study reproduction.

## The seven changes

### 1. Zing House Roof (id 1288) — already replaced ~3 years ago

| Field | Current | Proposed |
|---|---|---|
| `placedInServiceYear` | 2005 | **2023** |
| `replacementYear` | 2035 | **2053** (2023 + 30) |
| `actualCost` | $4,000 | $4,000 (keep unless family provides actual) |

The roof was replaced ~2023, so it's freshly in service. Next replacement is 2053, well outside the default 2046 horizon. This *removes* a $4K expenditure from 2035.

**Cost caveat:** If the family paid a different amount in 2023, `actualCost` should be updated. The model treats `actualCost` as 2027-base-year dollars; a 2023 cost would technically need inflation adjustment (×1.02⁴), but for planning precision this is negligible.

### 2. Main House Siding (id 1272) — replaced/repaired in last 5 years, good

| Field | Current | Proposed |
|---|---|---|
| `placedInServiceYear` | 1985 | **2022** |
| `replacementYear` | 2027 | **2062** (2022 + 40) |
| `actualCost` | $58,000 | $58,000 (keep unless family provides actual) |

Currently the single largest 2027 expenditure ($58K). Moving it to 2062 *removes* $58K from 2027 — a major change to the early-horizon picture. Same cost caveat as above.

### 3. Main House Roof (id 1271) — ridge lines shot, needs 1–3 years not 8

| Field | Current | Proposed |
|---|---|---|
| `replacementYear` | 2035 | **2028** |
| `usefulLife` | 30 | 30 (keep for recurrence interval) |
| `actualCost` | $36,000 | $36,000 |

"Ridge lines are shot now" means the roof is effectively at end-of-life. Moving replacementYear to 2028 (2 years from the 2026 study date) brings this expense *into* the early horizon. Subsequent replacements recur at 2028 + 30 = 2058 (outside default horizon).

### 4. Icehouse Roof (id 1284) — same urgency as main house

| Field | Current | Proposed |
|---|---|---|
| `replacementYear` | 2035 | **2028** |
| `usefulLife` | 30 | 30 |
| `actualCost` | $3,000 | $3,000 |

Same logic as #3. Brings a $3K expense into 2028.

### 5. Dock — new component, ice-out damage ~every 10 years, ~$50K

| Field | Proposed value |
|---|---|
| `id` | 1289 |
| `description` | "Dock - Ice Damage Repair" |
| `building` | "Dock" |
| `category` | "Grounds Components" |
| `placedInServiceYear` | 2022 (last known repair) |
| `usefulLife` | 10 |
| `adjustment` | 0 |
| `replacementYear` | **2032** (10 years from last known, conservative middle) |
| `actualCost` | $50,000 |

Fits the existing model cleanly: `usefulLife` = recurrence interval, `expenditureYears` generates 2032, 2042 within the default horizon.

**Probabilistic caveat:** The feedback says "on average once every ten years" — ice damage is probabilistic, but the model is deterministic. The family could model a worst-case variant (usefulLife: 7) vs. average (usefulLife: 10). The proposal uses 10 as the baseline. The $50K figure is itself a "depending on extent" estimate, so this is inherently fuzzy.

### 6. Driveway — new component, shared expense ~$5K every 5 years

| Field | Proposed value |
|---|---|
| `id` | 1290 |
| `description` | "Driveway - Maintenance/Repair" |
| `building` | "Driveway" |
| `category` | "Grounds Components" |
| `placedInServiceYear` | 2022 |
| `usefulLife` | 5 |
| `adjustment` | 0 |
| `replacementYear` | **2027** (first in horizon) |
| `actualCost` | $5,000 (family's share, net of neighbor contribution) |

Recurs at 2027, 2032, 2037, 2042 within the default horizon. The $5K is described as the family's share ("shared with the neighbors but still is probably 5K"), so no adjustment needed for cost-sharing.

### 7. Forestry — new component, ~$10K every 5 years

| Field | Proposed value |
|---|---|
| `id` | 1291 |
| `description` | "Forestry - Tree/Trail Maintenance" |
| `building` | "Forestry" |
| `category` | "Grounds Components" |
| `placedInServiceYear` | 2022 |
| `usefulLife` | 5 |
| `adjustment` | 0 |
| `replacementYear` | **2027** |
| `actualCost` | $10,000 |

Recurs at 2027, 2032, 2037, 2042. Covers tree service, trail cutting, firewood, disease response — bundled as a single recurring line item per the feedback ("say 10K every five years").

## No structural code changes needed for the data itself

The existing `Component` type and `simulate` pipeline handle all seven changes without modification:
- Recurring expenses (dock, driveway, forestry) work via `usefulLife` as the recurrence interval — `expenditureYears` already generates the right years.
- All three new items fit under the existing `"Grounds Components"` category — no new `Category` enum value, no theme color additions, no `emptyCategoryMap` changes.
- The `futureCost` inflation formula applies uniformly.

## Collateral changes required

| File | Change |
|---|---|
| `src/data/components.ts` | Update 4 existing components, add 3 new. Retire `PUBLISHED_FIXTURES` as functional data (keep as commented reference or delete). Update `STUDY_DEFAULTS` comment. |
| `src/lib/simulate.ts` | Remove `PUBLISHED_FF` lookup in `fullyFundedForYear` (lines 18-28); always compute via straight-line method. |
| `tests/simulate.test.ts` | Remove the study-reproduction test block (lines 52-88). Remove study-specific `futureCost`/`expenditureYears` assertions that reference changed components. Replace with: structural tests (expenditure years correct for new/changed components, category sums match totals, new recurring components fire at expected intervals). Update `solveContribution` tests to use new totals. |
| `src/components/ComponentTable.tsx` | Update "The 22 components" → "The 25 components" (line 86). Update "Read-only reference, exactly as the study specifies" (line 87) → something like "Updated with family-ground-truth corrections." |
| `src/presets.ts` | No code change needed — break-even and fully-funded presets solve against `COMPONENTS` dynamically, so they'll auto-adjust. But the solved contributions will change (likely higher), which is correct. |
| `AGENTS.md` | Update data provenance section: note that the model now incorporates family corrections and no longer reproduces the study's published projection exactly. |
| `src/components/Footer.tsx` | Update the "Model derived from study parameters" line to reflect the updated data. |

## Net impact on the default projection

The changes shift the expenditure profile significantly:
- **2027 loses** ~$58K (siding moved out) but **gains** $15K (driveway + forestry). Net: still large negative but less catastrophic.
- **2028 gains** ~$39K (main house roof $36K + icehouse roof $3K) — a new major expenditure year that wasn't in the study.
- **2032 gains** $15K (driveway + forestry recurring).
- **2035 loses** ~$43K (Zing roof $4K + main house roof $36K + icehouse roof $3K moved earlier) — the study's biggest expenditure year becomes much lighter.
- **2032 and 2042 gain** $50K each (dock ice damage).

Overall total expenditures across 2027–2046 will likely increase (the recurring items add more than the moved-out items save), and the break-even/fully-funded contribution presets will solve to higher numbers.

## Key files for a fresh agent to read

- `src/data/components.ts` — the `COMPONENTS` array (22 items, lines 17-40) and `PUBLISHED_FIXTURES` (lines 46-73)
- `src/lib/simulate.ts` — the simulation engine, `fullyFundedForYear` (lines 22-45), `futureCost` (lines 51-60), `expenditureYears` (lines 66-80)
- `tests/simulate.test.ts` — the 32 tests that enforce study fidelity (will need rewriting)
- `src/types.ts` — the `Component` and `Category` types
- `src/presets.ts` — preset scenarios that solve dynamically against `COMPONENTS`
- `src/components/ComponentTable.tsx` — the reference table UI (hardcoded "22 components" label)
- `src/theme.ts` — category colors (no changes needed, all new items use "Grounds Components")

## Open questions for the family (now answered - implement)

1. **Actual costs** for the Zing roof (2023) and main house siding (~2022) replacements — should we use real costs or keep the study's estimates?

Real costs

2. **Dock first occurrence** — was the last major ice-out damage recent (e.g., ~2022, making next ~2032) or longer ago? This determines whether the first $50K hits in 2032 vs. 2037.
   
   2022

3. **Dock worst-case modeling** — should we also offer a pessimistic variant (7-year cycle) alongside the 10-year average?

No

4. **Forestry scope** — is $10K/5yr meant to cover *only* professional tree service, or also the family's own labor (driveway cuttings, power pruner)? If the latter, the cash expense might be lower.

Only professional tree service.
