import { useEffect, useRef, useState } from "react";

export default function BudgetFilter({ value, onChange, min = 600, max = 4000, step = 50 }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onEsc(e){ if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="budget-popover">
      <button
        ref={btnRef}
        type="button"
        className="input budget-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>Budget</span>
        <strong>${value}</strong>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="budget-panel" ref={panelRef} role="dialog" aria-label="Set budget">
          <label htmlFor="budgetRange">Max cost (USD)</label>
          <input
            id="budgetRange"
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
          />
          <div className="budget-readout">${value}</div>
          <div className="panel-actions">
            <button className="btn" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
