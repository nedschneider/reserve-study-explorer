interface Props {
  onReset: () => void;
}

export default function Header({ onReset }: Props) {
  return (
    <header className="header">
      <style>{`
        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          padding: 40px 0 32px;
          flex-wrap: wrap;
        }
        .header-brand h1 {
          font-size: 30px;
          line-height: 1.1;
        }
        .header-brand .place {
          font-family: var(--font-ui);
          color: var(--ink-soft);
          font-size: 15px;
          margin-top: 4px;
        }
        .header-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }
        .btn {
          font-family: var(--font-ui);
          font-size: 14px;
          font-weight: 600;
          border-radius: 999px;
          padding: 10px 18px;
          border: 1px solid var(--rule);
          background: var(--card);
          color: var(--ink);
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .btn:hover {
          background: var(--paper-2);
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn-ghost {
          border-color: transparent;
          background: transparent;
          color: var(--ink-soft);
        }
        .btn-ghost:hover {
          background: var(--paper-2);
        }
        @media (max-width: 720px) {
          .header { padding: 24px 0 20px; }
          .header-brand h1 { font-size: 24px; }
        }
      `}</style>
      <div className="header-brand">
        <h1>Timberlost LLC</h1>
        <div className="place">Reserve Study Explorer</div>
      </div>
      <div className="header-actions">
        <button className="btn btn-ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>
  );
}
