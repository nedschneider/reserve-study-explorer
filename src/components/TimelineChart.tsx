import { useState } from "react";
import { CATEGORIES } from "../types";
import { CATEGORY_HEX, CATEGORY_HEX_DESAT } from "../theme";
import { usdCompact, usd } from "../lib/format";
import type { YearResult } from "../types";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

interface Props {
  results: YearResult[];
}

export default function TimelineChart({ results }: Props) {
  const data = results.map((r) => ({
    year: r.year,
    balance: Math.round(r.endingBalance),
    expenditures: Math.round(r.expenditures),
    Roofing: Math.round(r.expendituresByCategory.Roofing),
    "Interior Furnishings": Math.round(r.expendituresByCategory["Interior Furnishings"]),
    Equipment: Math.round(r.expendituresByCategory.Equipment),
    "Building Components": Math.round(r.expendituresByCategory["Building Components"]),
    "Grounds Components": Math.round(r.expendituresByCategory["Grounds Components"]),
    components: r.expendituresByComponent,
    contribution: Math.round(r.contribution),
    interest: Math.round(r.interest),
    percentFunded: r.percentFunded,
  }));

  const maxBalance = Math.max(...results.map((r) => r.endingBalance));
  const minBalance = Math.min(...results.map((r) => r.endingBalance));
  const maxExpenditure = Math.max(...results.map((r) => r.expenditures));

  const chartWidth = Math.max(900, data.length * 52);

  return (
    <section className="section timeline">
      <style>{`
        .timeline .card { padding: 20px 20px 12px; }
        .timeline-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .timeline-head h2 { font-size: 22px; }
        .timeline-legend {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          font-size: 12px;
          color: var(--ink-soft);
          justify-content: center;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid var(--rule-soft);
        }
        .legend-item { display: inline-flex; align-items: center; gap: 6px; }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 3px;
        }
        .timeline-scroll {
          overflow-x: auto;
          margin: 0 -20px;
          padding: 0 20px;
        }
        .timeline-tooltip {
          background: var(--card);
          border: 1px solid var(--rule);
          border-radius: 12px;
          padding: 10px 14px 12px;
          box-shadow: var(--card-shadow);
          font-size: 13px;
          min-width: 220px;
          max-width: 320px;
          max-height: 280px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .timeline-tooltip.shortfall-zone {
          border-left: 3px solid var(--shortfall);
        }
        .timeline-tooltip.surplus-zone {
          border-left: 3px solid var(--surplus);
        }
        .tt-year {
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 6px;
          color: var(--ink);
        }
        .tt-summary {
          padding: 6px 0 8px;
          margin-bottom: 4px;
          flex-shrink: 0;
        }
        .tt-summary-balance {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: baseline;
          font-size: 14px;
          margin-bottom: 2px;
        }
        .tt-summary-balance .lbl {
          color: var(--ink-faint);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        .tt-summary-balance .val {
          font-family: var(--font-display);
          font-variant-numeric: tabular-nums;
          font-weight: 700;
          font-size: 15px;
          color: var(--ink);
        }
        .tt-summary-balance .val.shortfall { color: var(--shortfall); }
        .tt-summary-balance .val.surplus { color: var(--surplus); }
        .tt-section {
          margin-top: 6px;
          padding-top: 0;
          flex-shrink: 0;
        }
        .tt-section-out {
          flex: 1 1 auto;
          min-height: 0;
          display: flex;
          flex-direction: column;
          margin-top: 6px;
        }
        .tt-components-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          margin-top: 4px;
          padding: 4px 8px 4px 0;
          font-size: 12px;
        }
        .tt-components-scroll::-webkit-scrollbar { width: 6px; }
        .tt-components-scroll::-webkit-scrollbar-thumb {
          background: var(--rule);
          border-radius: 3px;
        }
        .tt-section:first-of-type {
          margin-top: 0;
          padding-top: 0;
        }
        .tt-section-scroll {
          flex: 1 1 auto;
          min-height: 0;
          overflow-y: auto;
          margin: 0 -14px -12px;
          padding: 0 14px 12px;
        }
        .tt-section-scroll::-webkit-scrollbar { width: 6px; }
        .tt-section-scroll::-webkit-scrollbar-thumb {
          background: var(--rule);
          border-radius: 3px;
        }
        .tt-section-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: var(--ink-faint);
          margin-bottom: 4px;
        }
        .tt-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 0;
          font-size: 13px;
        }
        .tt-row .lbl { color: var(--ink-soft); }
        .tt-row .val {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          color: var(--ink);
          text-align: right;
        }
        .tt-row .val.shortfall { color: var(--shortfall); }
        .tt-row .val.surplus { color: var(--surplus); }
        .tt-components {
          font-size: 12px;
        }
        .tt-comp-header {
          font-weight: 600;
          color: var(--ink);
          margin-bottom: 3px;
          font-size: 11px;
        }
        .tt-comp {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--ink-soft);
          padding: 1px 0;
        }
        .tt-comp-left {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .tt-comp-pip {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          flex-shrink: 0;
          margin-top: 5px;
        }
        .tt-comp .val {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          color: var(--ink);
        }
      `}</style>
      <div className="card">
        <div className="timeline-head">
          <div>
            <div className="eyebrow">The Exhibit</div>
            <h2>Timeline of expenditures &amp; the reserve runway</h2>
          </div>
        </div>
        <div className="timeline-scroll">
          <div style={{ width: chartWidth, height: 340 }}>
            <ResponsiveTimeline
              data={data}
              minBalance={minBalance}
              maxBalance={maxBalance}
              maxExpenditure={maxExpenditure}
            />
          </div>
        </div>
        <div className="timeline-legend">
          {CATEGORIES.map((c) => (
            <span className="legend-item" key={c}>
              <span className="legend-dot" style={{ background: CATEGORY_HEX[c] }} />
              {c}
            </span>
          ))}
          <span className="legend-item">
            <span
              className="legend-dot"
              style={{
                background: "transparent",
                borderTop: "3px solid #0d6e6e",
                width: 16,
                height: 0,
              }}
            />
            Reserve balance
          </span>
        </div>
      </div>
    </section>
  );
}

function ResponsiveTimeline({
  data,
  minBalance,
  maxBalance,
  maxExpenditure,
}: {
  data: any[];
  minBalance: number;
  maxBalance: number;
  maxExpenditure: number;
}) {
  const balanceDomain = [
    Math.floor((minBalance - 20000) / 50000) * 50000,
    Math.ceil((maxBalance + 20000) / 50000) * 50000,
  ];
  const expDomain = [0, Math.ceil((maxExpenditure + 5000) / 10000) * 10000];

  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 32, right: 12, left: 24, bottom: 8 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="var(--rule-soft)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fill: "var(--ink-soft)", fontSize: 12, fontFamily: "var(--font-ui)" }}
          axisLine={{ stroke: "var(--rule)" }}
          tickLine={false}
          interval={1}
        />
        <YAxis
          yAxisId="balance"
          domain={balanceDomain}
          orientation="left"
          tick={{ fill: "var(--ink-faint)", fontSize: 11 }}
          tickFormatter={usdCompact}
          axisLine={false}
          tickLine={false}
          width={48}
          label={{ value: "Reserve balance", position: "top", offset: 20, style: { fontSize: 11, fill: "var(--ink-soft)", fontWeight: 600, fontFamily: "var(--font-ui)" } }}
          ticks={(() => {
            const step = 50000;
            const ticks: number[] = [];
            for (let t = Math.ceil(balanceDomain[0] / step) * step; t <= balanceDomain[1]; t += step) {
              ticks.push(t);
            }
            return ticks;
          })()}
        />
        <YAxis
          yAxisId="exp"
          domain={expDomain}
          orientation="right"
          tick={{ fill: "var(--ink-faint)", fontSize: 11 }}
          tickFormatter={usdCompact}
          axisLine={false}
          tickLine={false}
          width={48}
          label={{ value: "Expenses", position: "top", offset: 20, style: { fontSize: 11, fill: "var(--ink-soft)", fontWeight: 600, fontFamily: "var(--font-ui)" } }}
        />
        <Tooltip content={<TimelineTooltip />} cursor={{ fill: "rgba(28,27,25,0.04)" }} offset={16} allowEscapeViewBox={{ x: false, y: true }} />
        <ReferenceLine yAxisId="balance" y={0} stroke="var(--ink-faint)" strokeWidth={1.5} strokeDasharray="4 4" />
        {CATEGORIES.map((c) => (
          <Bar
            key={c}
            yAxisId="exp"
            dataKey={c}
            stackId="exp"
            fill={CATEGORY_HEX_DESAT[c]}
            maxBarSize={36}
            radius={c === "Grounds Components" ? [3, 3, 0, 0] : 0}
            onMouseEnter={(_data, index) => {
              const year = data[index]?.year;
              if (typeof year === "number") setHoveredYear(year);
            }}
            onMouseLeave={() => setHoveredYear(null)}
            shape={(props: any) => {
              const year = props?.payload?.year;
              const isActive = hoveredYear !== null && hoveredYear === year;
              return (
                <rect
                  {...props}
                  fillOpacity={isActive ? 1 : 0.5}
                  style={{ ...props.style, transition: "fill-opacity 0.2s" }}
                />
              );
            }}
          />
        ))}
        <Line
          yAxisId="balance"
          type="monotone"
          dataKey="balance"
          stroke="#0d6e6e"
          strokeWidth={5}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            const negative = payload?.balance < 0;
            const fill = negative ? "#c0492c" : "#0d6e6e";
            return (
              <circle
                key={`dot-${payload?.year}`}
                cx={cx}
                cy={cy}
                r={4}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
                style={{ transition: "r 0.2s" }}
              />
            );
          }}
          activeDot={(props: any) => {
            const { cx, cy, payload } = props;
            const negative = payload?.balance < 0;
            const fill = negative ? "#c0492c" : "#0d6e6e";
            return (
              <circle
                key={`active-dot-${payload?.year}`}
                cx={cx}
                cy={cy}
                r={8}
                fill={fill}
                stroke="#fff"
                strokeWidth={2}
              />
            );
          }}
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function TimelineTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const comps = d.components ?? [];
  const hasIn = d.contribution > 0 || d.interest > 0;
  const hasOut = d.expenditures > 0;
  const hasComponents = comps.length > 0;
  const zoneClass = d.balance < 0 ? "shortfall-zone" : d.balance > 0 ? "surplus-zone" : "";

  return (
    <div className={`timeline-tooltip ${zoneClass}`}>
      <div className="tt-year">{d.year}</div>

      <div className="tt-summary">
        <div className="tt-summary-balance">
          <span className="lbl">Reserve balance</span>
          <span className={`val ${d.balance < 0 ? "shortfall" : d.balance > 0 ? "surplus" : ""}`}>
            {usd(d.balance)}
          </span>
        </div>
        <div className="tt-row">
          <span className="lbl">% funded</span>
          <span className="val">{Math.round(d.percentFunded * 100)}%</span>
        </div>
      </div>

      {hasIn && (
        <div className="tt-section">
          <div className="tt-section-title">Money in</div>
          {d.contribution > 0 && (
            <div className="tt-row">
              <span className="lbl">Contribution</span>
              <span className="val">{usd(d.contribution)}</span>
            </div>
          )}
          {d.interest > 0 && (
            <div className="tt-row">
              <span className="lbl">Interest earned</span>
              <span className="val">{usd(d.interest)}</span>
            </div>
          )}
        </div>
      )}

      {hasOut && (
        <div className="tt-section tt-section-out">
          <div className="tt-section-title">Money out</div>
          <div className="tt-row tt-total-row">
            <span className="lbl">Total expenditures</span>
            <span className="val">{usd(d.expenditures)}</span>
          </div>
          {hasComponents && (
            <div className="tt-components-scroll">
              <div className="tt-comp-header">Replacements</div>
              {comps.map((c: any) => (
                <div className="tt-comp" key={c.id}>
                  <span className="tt-comp-left">
                    <span className="tt-comp-pip" style={{ background: CATEGORY_HEX[c.category as keyof typeof CATEGORY_HEX] }} />
                    {c.description}
                  </span>
                  <span className="val">{usd(c.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
