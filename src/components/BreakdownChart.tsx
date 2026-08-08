import type { YearResult, Category } from "../types";
import { CATEGORIES } from "../types";
import { CATEGORY_HEX } from "../theme";
import { usd } from "../lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  results: YearResult[];
}

export default function BreakdownChart({ results }: Props) {
  const byCategory: { name: Category; value: number }[] = CATEGORIES.map((c) => ({
    name: c,
    value: Math.round(results.reduce((a, r) => a + r.expendituresByCategory[c], 0)),
  })).filter((d) => d.value > 0);

  const buildingTotals = new Map<string, number>();
  for (const r of results) {
    for (const comp of r.expendituresByComponent) {
      const b = comp.description.split(" - ")[0];
      buildingTotals.set(b, (buildingTotals.get(b) ?? 0) + comp.amount);
    }
  }
  const byBuilding = Array.from(buildingTotals.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value);

  const buildingColors = [
    "#3b6ea5",
    "#c28b3c",
    "#6b4e8e",
    "#3e8e7e",
    "#a35b3b",
    "#5a7c3a",
    "#8a4a6b",
    "#2a5d7a",
  ];

  return (
    <section className="section breakdown">
      <style>{`
        .breakdown .card { display: flex; flex-direction: column; gap: 16px; }
        .breakdown-head h2 { font-size: 22px; }
        .breakdown-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 720px) {
          .breakdown-grid { grid-template-columns: 1fr; }
        }
        .donut-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .donut-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--ink-soft);
        }
        .donut-chart {
          width: 100%;
          height: 240px;
        }
        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .dl-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
        }
        .dl-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--ink-soft);
        }
        .dl-dot {
          width: 10px; height: 10px; border-radius: 3px;
        }
        .dl-val {
          font-variant-numeric: tabular-nums;
          font-weight: 600;
          color: var(--ink);
        }
      `}</style>
      <div className="card">
        <div className="breakdown-head">
          <div className="eyebrow">Where the money goes</div>
          <h2>Spend over the whole horizon</h2>
        </div>
        <div className="breakdown-grid">
          <div className="donut-wrap">
            <div className="donut-title">By category</div>
            <div className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="var(--card)"
                  >
                    {byCategory.map((d) => (
                      <Cell key={d.name} fill={CATEGORY_HEX[d.name]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => usd(v)}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--rule)",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="donut-legend">
              {byCategory.map((d) => (
                <div className="dl-row" key={d.name}>
                  <span className="dl-left">
                    <span className="dl-dot" style={{ background: CATEGORY_HEX[d.name] }} />
                    {d.name}
                  </span>
                  <span className="dl-val">{usd(d.value)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="donut-wrap">
            <div className="donut-title">By building</div>
            <div className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byBuilding}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    stroke="var(--card)"
                  >
                    {byBuilding.map((_, i) => (
                      <Cell key={i} fill={buildingColors[i % buildingColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number) => usd(v)}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid var(--rule)",
                      fontSize: 13,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="donut-legend">
              {byBuilding.map((d, i) => (
                <div className="dl-row" key={d.name}>
                  <span className="dl-left">
                    <span
                      className="dl-dot"
                      style={{ background: buildingColors[i % buildingColors.length] }}
                    />
                    {d.name}
                  </span>
                  <span className="dl-val">{usd(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
