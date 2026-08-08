import type { Scenario, YearResult } from "../types";
import { usd } from "../lib/format";

interface Props {
  results: YearResult[];
  scenario: Scenario;
  breakEvenContribution: number;
}

interface OutcomeCard {
  label: string;
  value: string;
  sub: string;
  tone: "neutral" | "shortfall" | "surplus";
}

export default function OutcomeCards({ results, scenario, breakEvenContribution }: Props) {
  const minBalance = Math.min(...results.map((r) => r.endingBalance));
  const minYear = results.find((r) => r.endingBalance === minBalance)?.year;
  const firstShortfall = results.find((r) => r.endingBalance < 0)?.year;
  const last = results[results.length - 1];
  const totalContributed = results.reduce((a, r) => a + r.contribution, 0);
  const totalSpent = results.reduce((a, r) => a + r.expenditures, 0);
  const finalPct = last?.percentFunded ?? 0;

  const cards: OutcomeCard[] = [
    {
      label: "Lowest balance",
      value: usd(minBalance),
      sub: minBalance < 0 ? `dipped below zero in ${minYear}` : `stays positive, trough in ${minYear}`,
      tone: minBalance < 0 ? "shortfall" : "surplus",
    },
    {
      label: "First shortfall",
      value: firstShortfall ? String(firstShortfall) : "None",
      sub: firstShortfall ? "reserve first dips below $0" : "stays in the black",
      tone: firstShortfall ? "shortfall" : "surplus",
    },
    {
      label: "Total contributed",
      value: usd(totalContributed),
      sub: `family contributions, ${results.length} years`,
      tone: "neutral",
    },
    {
      label: "Total spent",
      value: usd(totalSpent),
      sub: "on replacements & repairs",
      tone: "neutral",
    },
    {
      label: "Ending balance",
      value: usd(last?.endingBalance ?? 0),
      sub: `in ${scenario.horizonEndYear}`,
      tone: (last?.endingBalance ?? 0) < 0 ? "shortfall" : "surplus",
    },
    {
      label: "Final % funded",
      value: `${Math.round(finalPct * 100)}%`,
      sub: "vs. fully-funded target",
      tone: finalPct >= 1 ? "surplus" : "shortfall",
    },
  ];

  return (
    <section className="section outcomes">
      <style>{`
        .outcomes h2 { font-size: 22px; margin-bottom: 16px; }
        .outcome-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 16px;
        }
        .outcome-card {
          background: var(--card);
          border: 1px solid var(--rule);
          border-radius: var(--radius-sm);
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .outcome-card .label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--ink-faint);
          font-weight: 600;
        }
        .outcome-card .value {
          font-family: var(--font-display);
          font-size: 30px;
          font-weight: 600;
          line-height: 1.05;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .outcome-card .sub {
          font-size: 12px;
          color: var(--ink-soft);
        }
        .outcome-card.tone-shortfall .value { color: var(--shortfall); }
        .outcome-card.tone-surplus .value { color: var(--surplus); }
        .outcome-card.tone-neutral .value { color: var(--ink); }
        .outcome-highlight {
          border-color: rgba(192,73,44,0.25);
          background: var(--shortfall-bg);
        }
        .outcome-highlight .value { color: var(--shortfall); }
        .outcome-highlight button {
          margin-top: 6px;
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
          padding: 6px 12px;
          border: 1px solid var(--shortfall);
          background: var(--shortfall);
          color: var(--paper);
          align-self: flex-start;
          transition: background 0.15s, transform 0.1s;
        }
        .outcome-highlight button:hover { background: #a83d24; }
        .outcome-highlight button:active { transform: translateY(1px); }
      `}</style>
      <div className="eyebrow">The bottom line</div>
      <h2>Outcomes</h2>
      <div className="outcome-grid">
        {cards.map((c) => (
          <div className={`outcome-card tone-${c.tone}`} key={c.label}>
            <span className="label">{c.label}</span>
            <span className="value">{c.value}</span>
            <span className="sub">{c.sub}</span>
          </div>
        ))}
        <div className="outcome-card outcome-highlight">
          <span className="label">To break even</span>
          <span className="value">{usd(breakEvenContribution)}/yr</span>
          <span className="sub">with current other levers</span>
        </div>
      </div>
    </section>
  );
}
