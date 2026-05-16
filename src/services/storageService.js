const TODAY_KEY = () => `lim_log_${new Date().toISOString().slice(0, 10)}`;
const GOAL_KEY = "lim_calorie_goal";

// ── Daily Log ──────────────────────────────────────────────────────────────
export function getTodayLog() {
  try {
    return JSON.parse(localStorage.getItem(TODAY_KEY()) || "[]");
  } catch { return []; }
}

export function addToLog(entry) {
  try {
    const log = getTodayLog();
    log.unshift(entry); // newest first
    localStorage.setItem(TODAY_KEY(), JSON.stringify(log.slice(0, 50)));
  } catch {}
}

// ── Calorie Goal ───────────────────────────────────────────────────────────
export function getGoal() {
  return parseInt(localStorage.getItem(GOAL_KEY) || "2000", 10);
}

export function setGoal(kcal) {
  localStorage.setItem(GOAL_KEY, String(kcal));
}

// ── Weekly History ─────────────────────────────────────────────────────────
export function getWeekLog() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `lim_log_${d.toISOString().slice(0, 10)}`;
    try {
      const log = JSON.parse(localStorage.getItem(key) || "[]");
      days.push({ date: d.toISOString().slice(0, 10), log });
    } catch {
      days.push({ date: d.toISOString().slice(0, 10), log: [] });
    }
  }
  return days;
}

// ── Export Weekly Report ───────────────────────────────────────────────────
export function exportWeeklyReport() {
  const week = getWeekLog();
  let totalCal = 0, totalSugar = 0, green = 0, yellow = 0, red = 0;
  const lines = ["LIM PRO — WEEKLY DRINK REPORT", "=" .repeat(36), ""];

  week.forEach(({ date, log }) => {
    if (log.length === 0) return;
    const dayCal = log.reduce((s, i) => s + (i.calories || 0), 0);
    totalCal += dayCal;
    totalSugar += log.reduce((s, i) => s + (i.sugar_g || 0), 0);
    log.forEach((i) => {
      if (i.verdict === "GREEN") green++;
      else if (i.verdict === "YELLOW") yellow++;
      else if (i.verdict === "RED") red++;
    });

    lines.push(`📅 ${date}`);
    log.forEach((i) => {
      const icon = i.verdict === "GREEN" ? "✅" : i.verdict === "YELLOW" ? "⚠️" : "🚫";
      lines.push(`  ${icon} ${i.product || "Unknown"} — ${i.ml}ml — ${i.calories || 0}kcal`);
    });
    lines.push(`  Total: ${dayCal} kcal`, "");
  });

  lines.push("=" .repeat(36));
  lines.push(`WEEK TOTAL: ${totalCal} kcal | Sugar: ${totalSugar.toFixed(1)}g`);
  lines.push(`✅ GREEN: ${green}  ⚠️ YELLOW: ${yellow}  🚫 RED: ${red}`);

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lim-report-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
