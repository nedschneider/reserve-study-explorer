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

All asset and projection data is baked from the **Michael Callahan & Associates, LLC** reserve
study dated **June 18, 2026** (budget year Jan 1, 2027). The original PDF is the source of truth;
this app reproduces its numbers via a derived model:

- Future cost = `actualCost × (1 + inflation)^(replacementYear − 2027)`
- Default scenario (seed $0, contribution $0, inflation 2%, interest 0%) reproduces the study's
  published 2027–2046 projection exactly (verified by unit tests in `tests/simulate.test.ts`).

## Deploying

GitHub Pages via GitHub Actions (see `.github/workflows/deploy.yml`). `vite.config.ts` sets
`base = "/reserve-study-explorer/"` for project-site hosting; change to `"/"` for a custom domain
or `user.github.io` root.
