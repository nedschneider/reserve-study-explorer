import { useEffect, useRef, useState } from "react";
import type { Scenario, YearResult } from "../types";
import { usd, usdSigned } from "../lib/format";

interface Props {
  scenario: Scenario;
  results: YearResult[];
  breakEvenContribution: number;
  onApplyBreakEven: () => void;
}

/** Animated count-up for a numeric value, rendered as formatted currency. */
function useCountUp(value: number, duration = 450) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = value;
    };
  }, [value, duration]);

  return display;
}

export default function Hero({ scenario, results, breakEvenContribution, onApplyBreakEven }: Props) {
  const first = results[0];
  const last = results[results.length - 1];
  const todayBalance = first?.endingBalance ?? 0;
  const ending = last?.endingBalance ?? 0;

  const todayShortfall = Math.max(0, -todayBalance);
  const todaySurplus = Math.max(0, todayBalance);

  const animatedEnding = useCountUp(ending);

  const minBalance = Math.min(...results.map((r) => r.endingBalance));
  const minYear = results.find((r) => r.endingBalance === minBalance)?.year;

  const todayTone = todayBalance < 0 ? "shortfall" : "surplus";

  const verdict = (() => {
    if (todayShortfall > 0) {
      if (minBalance < todayBalance) {
        return {
          text: `Need ${usd(todayShortfall)} today to cover. Worst dip: ${usd(minBalance)} in ${minYear}.`,
          tone: "shortfall" as const,
        };
      }
      return {
        text: `Need ${usd(todayShortfall)} today to cover.`,
        tone: "shortfall" as const,
      };
    }
    if (todaySurplus > 0) {
      return {
        text: `Starting from a ${usd(todaySurplus)} surplus.`,
        tone: "surplus" as const,
      };
    }
    return {
      text: `Breaking even today.`,
      tone: "surplus" as const,
    };
  })();

  const endingVerdict = (() => {
    if (ending < 0 && minBalance < 0) {
      return `Shortfall continues through ${scenario.horizonEndYear}.`;
    }
    if (minBalance < 0) {
      return `Recovers by ${scenario.horizonEndYear}, but dips below zero along the way.`;
    }
    if (ending < 0) {
      return `Ends short by ${scenario.horizonEndYear}.`;
    }
    return `Stays positive through ${scenario.horizonEndYear}.`;
  })();

  const isAtBreakEven = Math.abs(scenario.annualContribution - breakEvenContribution) < 0.5;

  return (
    <section className="hero">
      <style>{`
        .hero {
          padding: 32px 0 8px;
        }
        .hero-eyebrow {
          margin-bottom: 14px;
        }
        .hero-numbers {
          display: flex;
          flex-wrap: wrap;
          gap: 36px;
          align-items: baseline;
        }
        .hero-number-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hero-number-label {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--ink-faint);
        }
        .hero-number {
          font-family: var(--font-display);
          font-size: clamp(48px, 9vw, 112px);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
          transition: color 0.3s;
        }
        .hero-number.shortfall { color: var(--shortfall); }
        .hero-number.surplus { color: var(--surplus); }
        .hero-number-secondary {
          font-size: clamp(36px, 6vw, 72px);
          color: var(--ink-soft);
        }
        .hero-sub {
          font-family: var(--font-ui);
          font-size: 18px;
          color: var(--ink-soft);
          margin-top: 16px;
          max-width: 640px;
        }
        .hero-sub strong {
          color: var(--ink);
          font-weight: 600;
        }
        .hero-verdict {
          display: inline-block;
          margin-top: 18px;
          font-size: 16px;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 999px;
        }
        .hero-verdict.shortfall {
          background: var(--shortfall-bg);
          color: var(--shortfall);
        }
        .hero-verdict.surplus {
          background: var(--surplus-bg);
          color: var(--surplus);
        }
        .hero-ending-verdict {
          margin-top: 10px;
          font-size: 15px;
          color: var(--ink-soft);
          font-weight: 500;
        }
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          flex-wrap: wrap;
        }
        .hero-break-even {
          font-size: 14px;
          color: var(--ink-faint);
        }
        .hero-break-even strong {
          color: var(--ink-soft);
          font-weight: 600;
        }
        .hero-break-even strong.shortfall { color: var(--shortfall); }
        .hero-current {
          color: var(--ink-faint);
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
        .btn-apply-break-even {
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
        .btn-apply-break-even:hover {
          background: #a83d24;
        }
        .btn-apply-break-even:active {
          transform: translateY(1px);
        }
        .btn-apply-break-even:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div className="hero-eyebrow eyebrow">
        {scenario.annualContribution === 0 && scenario.seed === 0
          ? "If nothing changes"
          : "Your scenario"}
      </div>
      <div className="hero-numbers">
        <div className="hero-number-wrap">
          <div className="hero-number-label">Today</div>
          <div className={`hero-number ${todayTone}`}>
            {todayShortfall > 0 ? "−" : "+"}{usd(Math.abs(todayBalance))}
          </div>
        </div>
        <div className="hero-number-wrap">
          <div className="hero-number-label">By {scenario.horizonEndYear}</div>
          <div className={`hero-number hero-number-secondary ${ending < 0 ? "shortfall" : "surplus"}`}>
            {usdSigned(animatedEnding)}
          </div>
        </div>
      </div>
      <div className="hero-sub">
        Projected reserve trajectory, contributing{" "}
        <strong>{usd(scenario.annualContribution)}/yr</strong>
        {scenario.contributionIncreasePct > 0
          ? ` (rising ${scenario.contributionIncreasePct}%/yr)`
          : ""}
        {scenario.seed > 0 ? `, starting with ${usd(scenario.seed)}` : ""}.
      </div>
      <span className={`hero-verdict ${verdict.tone}`}>{verdict.text}</span>
      <div className="hero-ending-verdict">{endingVerdict}</div>
      <div className="hero-actions">
        <span className="hero-break-even">
          To break even by {scenario.horizonEndYear}, contribute{" "}
          <strong className={scenario.annualContribution < breakEvenContribution ? "shortfall" : ""}>
            {usd(breakEvenContribution)}/yr
          </strong>{" "}
          <span className="hero-current">(Current {usd(scenario.annualContribution)})</span>.
        </span>
        {!isAtBreakEven && (
          <button className="btn-apply-break-even" onClick={onApplyBreakEven}>
            Apply break-even
          </button>
        )}
      </div>
    </section>
  );
}
