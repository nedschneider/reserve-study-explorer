export default function Footer() {
  return (
    <footer className="footer">
      <style>{`
        .footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid var(--rule);
          font-size: 13px;
          color: var(--ink-faint);
          line-height: 1.6;
        }
        .footer strong { color: var(--ink-soft); font-weight: 600; }
      `}</style>
      Data: Timberlost maintenance plan, June 18, 2026.
      Model derived from study parameters (2% inflation, 0% reserve interest, $0 start).
      Family planning use only.
    </footer>
  );
}
