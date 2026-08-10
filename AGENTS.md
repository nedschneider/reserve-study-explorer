# Reserve Study Explorer

Interactive reserve-study scenario explorer for the Timberlost LLC compound.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server (hot reload). |
| `npm run build` | Type-check (`tsc -b`) then build production bundle to `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run test` | Run unit tests once (Vitest). |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run typecheck` | Type-check only (`tsc --noEmit`). |
| `npm run lint` | Lint with ESLint. |

## Data provenance

Asset and projection data originated from a reserve study dated **June 18, 2026** (budget year
Jan 1, 2027) and has since been corrected with family-ground-truth knowledge of the compound
(moved-up roof replacements, freshly-replaced siding, new recurring items: dock, driveway,
forestry). The study's published projection is no longer reproduced exactly; the model now
reflects the family's actual maintenance realities:

- Future cost = `actualCost × (1 + inflation)^(replacementYear − 2027)`
- Fully-funded reserves computed via straight-line depreciation (no longer a study lookup table).
- Unit tests in `tests/simulate.test.ts` verify structural properties (expenditure scheduling,
  category sums, solver correctness) rather than study-fidelity.

## Deploying

GitHub Pages via GitHub Actions (see `.github/workflows/deploy.yml`). `vite.config.ts` sets
`base = "/reserve-study-explorer/"` for project-site hosting; change to `"/"` for a custom domain
or `user.github.io` root.
