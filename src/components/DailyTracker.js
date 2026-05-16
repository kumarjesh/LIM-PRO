import { useState } from "react";
import { getGoal, setGoal } from "../services/storageService";

const VERDICT_COLOR = { GREEN: "#22c55e", YELLOW: "#eab308", RED: "#ef4444" };

export default function DailyTracker({ log }) {
  const [goal, setGoalState] = useState(getGoal());
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(String(goal));

  const totalCal = log.reduce((s, i) => s + (i.calories || 0), 0);
  const totalSugar = log.reduce((s, i) => s + (i.sugar_g || 0), 0);
  const totalProtein = log.reduce((s, i) => s + (i.protein_g || 0), 0);
  const pct = Math.min((totalCal / goal) * 100, 100);

  const barColor = pct < 60 ? "#22c55e" : pct < 85 ? "#eab308" : "#ef4444";

  const saveGoal = () => {
    const val = parseInt(input, 10);
    if (val > 0 && val < 10000) {
      setGoal(val);
      setGoalState(val);
    }
    setEditing(false);
  };

  return (
    <div className="fade-in">
      {/* Goal card */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div className="section-heading">DAILY CALORIE GOAL</div>
            <div className="section-sub">FROM DRINKS ONLY</div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            style={{
              background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)",
              borderRadius: 8, padding: "6px 12px",
              color: "#22d3ee", fontSize: 12, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {editing ? "CANCEL" : "EDIT"}
          </button>
        </div>

        {editing && (
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1.5px solid #22d3ee", borderRadius: 10,
                padding: "10px 12px", color: "#fff",
                fontSize: 15, fontWeight: 700, outline: "none",
                fontFamily: "monospace",
              }}
            />
            <span style={{ display: "flex", alignItems: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>kcal</span>
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "10px 18px", fontSize: 13 }}
              onClick={saveGoal}
            >SAVE</button>
          </div>
        )}

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 28, color: barColor, letterSpacing: 1 }}>
            {totalCal}
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", alignSelf: "flex-end" }}>
            / {goal} kcal
          </span>
        </div>

        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, background: barColor }} />
        </div>

        <div style={{ textAlign: "right", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
          {Math.round(pct)}% of daily limit used
        </div>
      </div>

      {/* Macro totals */}
      <div className="card">
        <div className="section-heading" style={{ marginBottom: 12 }}>TODAY'S TOTALS</div>
        <div className="macro-row">
          {[
            { label: "SUGAR", val: totalSugar.toFixed(1), unit: "g", color: "#eab308" },
            { label: "PROTEIN", val: totalProtein.toFixed(1), unit: "g", color: "#22d3ee" },
            { label: "SCANS", val: log.length, unit: "", color: "#a78bfa" },
          ].map(({ label, val, unit, color }) => (
            <div key={label} className="macro-pill">
              <div className="macro-val" style={{ color }}>{val}<span className="macro-unit">{unit}</span></div>
              <div className="macro-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Verdict breakdown */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {[
            { v: "GREEN", icon: "✅", label: "Safe" },
            { v: "YELLOW", icon: "⚠️", label: "Caution" },
            { v: "RED", icon: "🚫", label: "Avoid" },
          ].map(({ v, icon, label }) => {
            const count = log.filter((i) => i.verdict === v).length;
            return (
              <div key={v} style={{
                flex: 1, background: "rgba(255,255,255,0.04)",
                border: `1px solid ${VERDICT_COLOR[v]}30`,
                borderRadius: 10, padding: "10px 6px", textAlign: "center",
              }}>
                <div style={{ fontSize: 18 }}>{icon}</div>
                <div style={{ fontSize: 18, fontFamily: "var(--font-display)", color: VERDICT_COLOR[v] }}>{count}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {log.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
          No scans today yet. Go scan a drink! 📷
        </div>
      )}
    </div>
  );
}
