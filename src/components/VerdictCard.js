import { useEffect, useRef } from "react";

const VERDICT_CONFIG = {
  GREEN:  { bg: "linear-gradient(160deg,#052e16,#14532d)", glow: "#22c55e", ring: "#4ade80", icon: "✅", label: "DRINK IT", badgeBg: "#dcfce7", badgeText: "#14532d" },
  YELLOW: { bg: "linear-gradient(160deg,#1c1400,#3d2e00)", glow: "#eab308", ring: "#facc15", icon: "⚠️", label: "THINK TWICE", badgeBg: "#fef9c3", badgeText: "#713f12" },
  RED:    { bg: "linear-gradient(160deg,#1c0000,#3b0a0a)", glow: "#ef4444", ring: "#f87171", icon: "🚫", label: "SKIP IT", badgeBg: "#fee2e2", badgeText: "#7f1d1d" },
};

// ── Macro Pie Chart ────────────────────────────────────────────────────────
function MacroPie({ protein, carbs, fat }) {
  const total = (protein || 0) * 4 + (carbs || 0) * 4 + (fat || 0) * 9;
  if (total === 0) return null;

  const pPct = ((protein || 0) * 4 / total) * 100;
  const cPct = ((carbs || 0) * 4 / total) * 100;
  const fPct = ((fat || 0) * 9 / total) * 100;

  const slices = [
    { pct: pPct, color: "#22d3ee", label: "Protein", val: protein, unit: "g" },
    { pct: cPct, color: "#f97316", label: "Carbs", val: carbs, unit: "g" },
    { pct: fPct, color: "#a78bfa", label: "Fat", val: fat, unit: "g" },
  ];

  // SVG arc path
  const R = 40, CX = 50, CY = 50;
  let paths = [];
  let startAngle = -90;
  slices.forEach(({ pct, color }) => {
    const angle = (pct / 100) * 360;
    const endAngle = startAngle + angle;
    const r2d = Math.PI / 180;
    const x1 = CX + R * Math.cos(startAngle * r2d);
    const y1 = CY + R * Math.sin(startAngle * r2d);
    const x2 = CX + R * Math.cos(endAngle * r2d);
    const y2 = CY + R * Math.sin(endAngle * r2d);
    const large = angle > 180 ? 1 : 0;
    if (pct > 1) {
      paths.push(
        <path key={color}
          d={`M${CX},${CY} L${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} Z`}
          fill={color} opacity={0.85}
        />
      );
    }
    startAngle = endAngle;
  });

  return (
    <div className="pie-wrap">
      <svg width="90" height="90" viewBox="0 0 100 100">
        {paths}
        <circle cx={CX} cy={CY} r={24} fill="#0d1117" />
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">
          MACROS
        </text>
      </svg>
      <div className="pie-legend">
        {slices.map(({ color, label, val, unit }) => (
          <div key={label} className="legend-item">
            <div className="legend-dot" style={{ background: color }} />
            <span>{label}:</span>
            <span style={{ color: "#fff", fontWeight: 700 }}>{val ?? 0}{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Voice Summary ──────────────────────────────────────────────────────────
function speakSummary(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.95;
  utt.pitch = 1;
  window.speechSynthesis.speak(utt);
}

// ── Main Verdict Card ───────────────────────────────────────────────────────
export default function VerdictCard({ result, image, ml, onRescan, onNew }) {
  const vc = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG.RED;
  const spokenRef = useRef(false);

  // Auto-speak on first render
  useEffect(() => {
    if (!spokenRef.current && result.summary) {
      setTimeout(() => speakSummary(result.summary), 600);
      spokenRef.current = true;
    }
  }, [result.summary]);

  return (
    <div className="verdict-appear">
      {/* ── Main verdict card ── */}
      <div style={{
        background: vc.bg,
        borderRadius: 22,
        padding: "26px 22px",
        border: `1.5px solid ${vc.ring}35`,
        boxShadow: `0 0 48px ${vc.glow}18`,
        marginBottom: 14,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)",
          width: 140, height: 140, borderRadius: "50%",
          background: `radial-gradient(circle, ${vc.glow}28, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Verdict header */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 46, marginBottom: 6 }}>{vc.icon}</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 34, letterSpacing: 5,
            color: vc.ring, lineHeight: 1,
            marginBottom: 8,
          }}>{vc.label}</div>
          <div style={{
            display: "inline-block",
            background: vc.badgeBg, color: vc.badgeText,
            borderRadius: 50, padding: "4px 14px",
            fontSize: 11, fontWeight: 700, letterSpacing: 1,
          }}>
            {result.brand ? `${result.brand} · ` : ""}{result.product || "PRODUCT"}
          </div>
        </div>

        {/* Macro pills */}
        <div className="macro-row">
          {[
            { label: "CALORIES", val: result.calories, unit: "kcal", color: "#f97316" },
            { label: "SUGAR", val: result.sugar_g, unit: "g", color: "#eab308" },
            { label: "PROTEIN", val: result.protein_g, unit: "g", color: "#22d3ee" },
            { label: "FAT", val: result.fat_g, unit: "g", color: "#a78bfa" },
          ].map(({ label, val, unit, color }) => (
            <div key={label} className="macro-pill">
              <div className="macro-val" style={{ color }}>
                {val ?? "—"}<span className="macro-unit">{unit}</span>
              </div>
              <div className="macro-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Qty chip */}
        <div style={{
          textAlign: "center", fontSize: 11,
          color: "rgba(255,255,255,0.35)", marginBottom: 14, fontFamily: "monospace",
        }}>
          Based on <strong style={{ color: "rgba(255,255,255,0.6)" }}>{ml}ml</strong> consumed
        </div>

        {/* Summary */}
        <div style={{
          background: "rgba(0,0,0,0.3)", borderRadius: 14,
          padding: "14px 16px", fontSize: 15, fontWeight: 600,
          color: "#fff", lineHeight: 1.5, marginBottom: 10,
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <span>{result.summary}</span>
          <button
            onClick={() => speakSummary(result.summary)}
            title="Read aloud"
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 18, flexShrink: 0, padding: 0, lineHeight: 1,
            }}
          >🔊</button>
        </div>

        {/* Tip */}
        {result.tip && (
          <div style={{
            background: `${vc.glow}12`, border: `1px solid ${vc.glow}28`,
            borderRadius: 10, padding: "10px 14px",
            fontSize: 12, color: vc.ring, fontWeight: 600,
          }}>
            💡 {result.tip}
          </div>
        )}
      </div>

      {/* ── Macro Pie ── */}
      <MacroPie
        protein={result.protein_g}
        carbs={result.carbs_g}
        fat={result.fat_g}
      />

      {/* ── Ingredient Flags ── */}
      {((result.flags_bad?.length > 0) || (result.flags_good?.length > 0)) && (
        <div className="card">
          <div className="section-heading" style={{ marginBottom: 10 }}>INGREDIENT REPORT</div>
          <div className="flag-row">
            {result.flags_bad?.map((f) => (
              <span key={f} className="flag-chip flag-bad">🚩 {f}</span>
            ))}
            {result.flags_good?.map((f) => (
              <span key={f} className="flag-chip flag-good">✅ {f}</span>
            ))}
          </div>
        </div>
      )}

      {/* ── Scanned image ── */}
      {image && (
        <div style={{
          borderRadius: 14, overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.07)",
          marginBottom: 14, maxHeight: 130,
        }}>
          <img src={image} alt="scanned pack" style={{ width: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* ── Actions ── */}
      <button className="btn btn-secondary" style={{ marginBottom: 8 }} onClick={onRescan}>
        🔄  CHANGE QUANTITY
      </button>
      <button className="btn btn-primary" onClick={onNew}>
        📷  SCAN ANOTHER DRINK
      </button>
    </div>
  );
}
