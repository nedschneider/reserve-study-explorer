# Task: Audit the Reserve Study Explorer UI against design goals

You are auditing the UI of a completed React/Vite app at `/Users/nedschneider/Documents/Reserve Study`.
The app is an interactive reserve-study scenario explorer for the Timberlost LLC
compound — a family property with 8 buildings and 22 replaceable assets. It lets a few family
members visualize the timeline of future maintenance expenditures and explore how financial
decisions affect the reserve's shortfall or surplus. The reserve today is **$0**.

Your job: review the UI against the design goals below, identify gaps or defects, and fix them.
This is a **code-and-fix** task, not just a review — make the changes directly.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server (hot reload). |
| `npm run build` | Type-check then build production bundle to `dist/`. |
| `npm run test` | Run unit tests (Vitest). |
| `npm run typecheck` | Type-check only. |
| `npm run lint` | Lint with ESLint. |

All of `typecheck`, `lint`, `test`, and `build` must pass when you're done.

## Design goals (the bar to meet)

The user described the desired vibe as **"museum for grown-ups"** — erring on the side of
**simplicity, boldness, fun, and clarity**. Specifically:

1. **Bold, confident hero.** The first thing you see should be a giant number showing the projected
   ending balance (shortfall in terracotta red, surplus in deep green), with a one-line plain-English
   verdict. It should feel like a museum exhibit label — immediate, striking, no jargon.

2. **The timeline is the centerpiece.** A full-width chart showing each year's expenditures as
   stacked bars (colored by category) with the reserve balance as a line crossing zero. The shortfall
   zone (below zero) should be visually distinct. Tooltips should show what's being replaced that
   year. It should be the most prominent visual element on the page.

3. **Levers are tactile and immediate.** Sliders for seed money, annual contribution, contribution
   raises, interest, inflation, and horizon. Moving any lever should instantly re-simulate and
   animate the hero number, chart, and outcome cards. There should be a prominent "break-even"
   readout showing the minimum contribution to end at $0 by the horizon, with a one-click button to
   apply it.

4. **Outcome cards give the bottom line at a glance.** A row of big-number cards: lowest balance,
   first shortfall year, total contributed, total spent, ending balance, final % funded.

5. **Breakdowns by category and building.** Donut/pie charts showing where the money goes over the
   whole horizon.

6. **Read-only component reference table.** All 22 assets with their details, collapsible, as a
   "museum label" provenance section. Not editable.

7. **Presets.** Quick-start buttons: Status Quo, Break-Even, Fully Funded, Steady Saver, Inflation
   Shock. These should set all levers at once.

8. **Shareable scenarios.** The current scenario is encoded in the URL (?s=...). A "Share" button
   copies the URL. Loading a shared URL restores the scenario.

9. **Visual style.** Warm paper background (#F6F2EA), dark ink text, terracotta shortfall accent
   (#C0492C), deep green surplus accent (#2F6B4F). Display font: Fraunces (serif). UI font: Inter.
   Generous whitespace, large rounded card corners, subtle shadows. Five-color category palette
   (Roofing blue, Interior amber, Equipment purple, Building teal, Grounds brown).

10. **Responsive.** Desktop-first but must stack gracefully on tablet and phone. The timeline chart
    should scroll horizontally on narrow screens rather than squishing.

11. **Provenance footer.** Cites the Michael Callahan & Associates study (June 18, 2026) and notes
    the model is derived from study parameters. "Family planning use only."

## What to check and fix

Go through each design goal above. For each, load the app (`npm run dev`), interact with it, and
verify the goal is met. 

Fix anything that's broken, missing, or doesn't meet the design goals. If something works but
could be more bold/fun/clear per the "museum for grown-ups" brief, improve it.

## What NOT to change

- The simulation engine (`src/lib/simulate.ts`) and data (`src/data/components.ts`) are verified
  correct — 32 unit tests lock the default scenario to the study's published numbers. Do not change
  the math or the 22 components' data.
- The solver definitions are now correct: "break-even" = ending balance ≥ 0 at the horizon end
  (~$16,795/yr); "fully-funded" = percent-funded ≥ 100% at the horizon end (~$31,610/yr). Don't
  change these semantics.
- The financial-levers-only scope: the project schedule (replacement years/costs) is fixed. Don't
  add per-project editing.
- No backend, no auth, no multi-user collaboration.

## Architecture summary (for context)

- `src/App.tsx` — top-level state (useReducer), URL sync, composes all components.
- `src/types.ts` — TypeScript types (Scenario, YearResult, SolveTarget, etc.).
- `src/data/components.ts` — the 22 components, study defaults, published fixtures.
- `src/lib/simulate.ts` — pure simulation engine + solver.
- `src/lib/format.ts` — currency/percent formatting helpers.
- `src/lib/urlState.ts` — encode/decode scenario to/from URL.
- `src/presets.ts` — 5 preset scenario definitions.
- `src/theme.ts` — category color maps.
- `src/components/` — Header, Hero, TimelineChart, LeverPanel, OutcomeCards, BreakdownChart,
  ComponentTable, Footer.
- `src/index.css` — global styles (CSS variables for palette, fonts, spacing).

## What to return

A summary of: (a) what you found that was already meeting the design goals, (b) what was broken or
missing and how you fixed each item, (c) any improvements you made for boldness/fun/clarity,
(d) confirmation that typecheck/lint/test/build all pass.
