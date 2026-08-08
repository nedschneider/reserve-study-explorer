import type { Scenario } from "../types";
import { usd } from "../lib/format";

interface LeverDef {
  key: keyof Scenario;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  format: (n: number) => string;
  hint: string;
}

const LEVERS: LeverDef[] = [
  {
    key: "seed",
    label: "Starting reserve",
    min: 0,
    max: 500000,
    step: 5000,
    unit: "$",
    format: usd,
    hint: "Money in the bank on Jan 1, 2027.",
  },
  {
    key: "annualContribution",
    label: "Annual contribution",
    min: 0,
    max: 80000,
    step: 500,
    unit: "$",
    format: usd,
    hint: "What the family puts in each year.",
  },
  {
    key: "interestRatePct",
    label: "Interest on reserve",
    min: 0,
    max: 8,
    step: 0.25,
    unit: "%",
    format: (n) => `${n}%`,
    hint: "Earned on positive balances only.",
  },
  {
    key: "contributionIncreasePct",
    label: "Contribution raises",
    min: 0,
    max: 10,
    step: 0.5,
    unit: "%",
    format: (n) => `${n}%`,
    hint: "How much contributions grow each year.",
  },
  {
    key: "inflationPct",
    label: "Inflation",
    min: 0,
    max: 6,
    step: 0.25,
    unit: "%",
    format: (n) => `${n}%`,
    hint: "Raises future replacement costs.",
  },
  {
    key: "horizonEndYear",
    label: "Horizon",
    min: 2030,
    max: 2070,
    step: 1,
    unit: "yr",
    format: (n) => `${n}`,
    hint: "How far out to project.",
  },
];

interface Props {
  scenario: Scenario;
  dispatch: (a: { type: "set"; patch: Partial<Scenario> }) => void;
  breakEvenContribution: number;
}

export default function LeverPanel({ scenario, dispatch, breakEvenContribution }: Props) {
  const isAtBreakEven = Math.abs(scenario.annualContribution - breakEvenContribution) < 0.5;

  return (
    <section className="section levers">
      <style>{`
        .levers .card { display: flex; flex-direction: column; gap: 22px; }
        .levers-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 12px;
        }
        .levers-head h2 { font-size: 22px; }
        .lever-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 22px 28px;
        }
        .lever { display: flex; flex-direction: column; gap: 8px; }
        .lever-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }
        .lever-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
        }
        .lever-value {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .lever input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: var(--rule);
          outline: none;
          cursor: pointer;
        }
        .lever input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ink);
          border: 3px solid var(--paper);
          box-shadow: 0 1px 4px rgba(28,27,25,0.3);
          cursor: grab;
        }
        .lever input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ink);
          border: 3px solid var(--paper);
          box-shadow: 0 1px 4px rgba(28,27,25,0.3);
          cursor: grab;
        }
        .lever-hint {
          font-size: 12px;
          color: var(--ink-faint);
        }
        .lever-number {
          width: 90px;
          font-family: var(--font-ui);
          font-size: 13px;
          text-align: right;
          border: 1px solid var(--rule);
          border-radius: 8px;
          padding: 4px 8px;
          color: var(--ink);
          background: var(--paper);
        }
        .break-even-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 18px;
          background: var(--card);
          border: 1px solid var(--rule-soft);
          border-radius: var(--radius-sm);
          flex-wrap: wrap;
        }
        .break-even-banner .lbl {
          font-size: 14px;
          color: var(--ink-soft);
        }
        .break-even-banner .val-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }
        .break-even-banner .val {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 600;
          color: var(--ink);
        }
        .break-even-banner .val.shortfall { color: var(--shortfall); }
        .break-even-banner .val-current {
          font-size: 13px;
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
        }
        .break-even-banner button {
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 600;
          border-radius: 999px;
          padding: 8px 16px;
          border: 1px solid var(--shortfall);
          background: var(--shortfall);
          color: var(--paper);
          transition: background 0.15s, transform 0.1s;
        }
        .break-even-banner button:hover { background: #a83d24; }
        .break-even-banner button:active { transform: translateY(1px); }
        .break-even-banner button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div className="card">
        <div className="levers-head">
          <div>
            <div className="eyebrow">What if?</div>
            <h2>Levers</h2>
          </div>
        </div>

        <div className="break-even-banner">
          <div>
            <div className="lbl">Smallest contribution to break even by {scenario.horizonEndYear}</div>
            <div className="val-row">
              <span className={`val ${scenario.annualContribution < breakEvenContribution ? "shortfall" : ""}`}>
                {usd(breakEvenContribution)}/yr
              </span>
              <span className="val-current">(Current {usd(scenario.annualContribution)})</span>
            </div>
          </div>
          {!isAtBreakEven ? (
            <button
              onClick={() =>
                dispatch({
                  type: "set",
                  patch: {
                    annualContribution: breakEvenContribution,
                    contributionIncreasePct: 0,
                  },
                })
              }
            >
              Set to {usd(breakEvenContribution)}/yr
            </button>
          ) : (
            <button disabled>At break-even</button>
          )}
        </div>

        <div className="lever-grid">
          {LEVERS.map((l) => (
            <div className="lever" key={l.key}>
              <div className="lever-top">
                <span className="lever-label">{l.label}</span>
                <input
                  className="lever-number"
                  type="number"
                  min={l.min}
                  max={l.max}
                  step={l.step}
                  value={scenario[l.key]}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!Number.isNaN(v))
                      dispatch({ type: "set", patch: { [l.key]: v } as Partial<Scenario> });
                  }}
                />
              </div>
              <input
                type="range"
                min={l.min}
                max={l.max}
                step={l.step}
                value={scenario[l.key]}
                onChange={(e) =>
                  dispatch({ type: "set", patch: { [l.key]: Number(e.target.value) } as Partial<Scenario> })
                }
              />
              <div className="lever-hint">{l.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
