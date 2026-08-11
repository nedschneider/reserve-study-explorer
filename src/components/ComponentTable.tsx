import { useState } from "react";
import { COMPONENTS } from "../data/components";
import { futureCost } from "../lib/simulate";
import { CATEGORY_HEX } from "../theme";
import { usd } from "../lib/format";

export default function ComponentTable() {
  const [open, setOpen] = useState(false);

  const rows = COMPONENTS.map((c) => ({
    ...c,
    name: c.description.includes(" - ")
      ? c.description.split(" - ").slice(1).join(" - ")
      : c.description,
    futureCost2: Math.round(futureCost(c.actualCost, 2, c.replacementYear)),
  })).sort((a, b) => a.replacementYear - b.replacementYear || a.building.localeCompare(b.building));

  return (
    <section className="section reference">
      <style>{`
        .reference .toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--card);
          border: 1px solid var(--rule);
          border-radius: var(--radius);
          padding: 18px 24px;
          cursor: pointer;
          box-shadow: var(--card-shadow);
        }
        .reference .toggle:hover { background: var(--paper-2); }
        .reference .toggle-left h2 { font-size: 20px; }
        .reference .toggle-left .sub { font-size: 13px; color: var(--ink-soft); margin-top: 2px; }
        .reference .chev {
          width: 18px; height: 18px;
          transition: transform 0.2s;
        }
        .reference.open .chev { transform: rotate(180deg); }
        .ref-table {
          margin-top: 12px;
          overflow-x: auto;
          background: var(--card);
          border: 1px solid var(--rule);
          border-radius: var(--radius);
          box-shadow: var(--card-shadow);
        }
        table.cmp {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        table.cmp th, table.cmp td {
          text-align: left;
          padding: 10px 16px;
          border-bottom: 1px solid var(--rule-soft);
          white-space: nowrap;
        }
        table.cmp th {
          font-weight: 600;
          color: var(--ink-soft);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          background: var(--paper-2);
        }
        table.cmp tr:last-child td { border-bottom: none; }
        table.cmp td.num { font-variant-numeric: tabular-nums; text-align: right; }
        table.cmp td.building { font-weight: 600; }
        .cat-pill {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
        }
        .ref-note {
          margin-top: 10px;
          font-size: 12px;
          color: var(--ink-faint);
        }
      `}</style>
      <div className="eyebrow">Museum label</div>
      <div className={`reference ${open ? "open" : ""}`}>
        <div className="toggle" onClick={() => setOpen((o) => !o)}>
          <div className="toggle-left">
            <h2>The {COMPONENTS.length} components</h2>
            <div className="sub">Sourced from the Timberlost maintenance plan</div>
          </div>
          <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {open && (
          <div className="ref-table">
            <table className="cmp">
              <thead>
                <tr>
                  <th>Building</th>
                  <th>Component</th>
                  <th>Category</th>
                  <th className="num">PIS yr</th>
                  <th className="num">Useful life</th>
                  <th className="num">Repl. year</th>
                  <th className="num">Actual cost</th>
                  <th className="num">Future cost (2%)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="building">{c.building}</td>
                    <td>{c.name}</td>
                    <td>
                      <span
                        className="cat-pill"
                        style={{ background: CATEGORY_HEX[c.category] }}
                      >
                        {c.category}
                      </span>
                    </td>
                    <td className="num">{c.placedInServiceYear}</td>
                    <td className="num">{c.usefulLife} yr</td>
                    <td className="num">{c.replacementYear}</td>
                    <td className="num">{usd(c.actualCost)}</td>
                    <td className="num">{usd(c.futureCost2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ref-note" style={{ padding: "0 16px 12px" }}>
              "Future cost" assumes 2% inflation from the 2027 base year, per the study.
              Changing the inflation lever in the app updates the live projection, not this table.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
