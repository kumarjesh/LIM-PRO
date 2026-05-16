import { useState, useRef, useCallback, useEffect } from "react";
import Camera from "./components/Camera";
import MlSelector from "./components/MlSelector";
import VerdictCard from "./components/VerdictCard";
import DailyTracker from "./components/DailyTracker";
import History from "./components/History";
import BarcodeScanner from "./components/BarcodeScanner";
import { analyzeDrink } from "./services/geminiService";
import { getTodayLog, addToLog, exportWeeklyReport } from "./services/storageService";
import "./App.css";

export default function App() {
  const [step, setStep] = useState("home"); // home | ml | loading | result
  const [image, setImage] = useState(null);
  const [selectedMl, setSelectedMl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("scan"); // scan | history | tracker
  const [todayLog, setTodayLog] = useState(getTodayLog());
  const [scanMode, setScanMode] = useState("camera"); // camera | barcode | upload
  const fileRef = useRef(null);

  // Refresh today log whenever tab changes
  useEffect(() => {
    setTodayLog(getTodayLog());
  }, [tab]);

  const handleImageReady = (b64) => {
    setImage(b64);
    setStep("ml");
    setError(null);
  };

  const analyze = async () => {
    if (!selectedMl || selectedMl < 1) return;
    setStep("loading");
    setError(null);
    try {
      const data = await analyzeDrink(image, selectedMl);
      setResult(data);
      // Save to history
      addToLog({ ...data, ml: selectedMl, image, timestamp: Date.now() });
      setTodayLog(getTodayLog());
      setStep("result");
    } catch (e) {
      setError("Analysis failed. Check API key or image quality.");
      setStep("ml");
    }
  };

  const reset = () => {
    setStep("home");
    setImage(null);
    setSelectedMl(null);
    setResult(null);
    setError(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleImageReady(ev.target.result);
    reader.readAsDataURL(file);
  };

  const todayCalories = todayLog.reduce((s, i) => s + (i.calories || 0), 0);

  return (
    <div className="app-shell">
      {/* ── Top Bar ── */}
      <header className="top-bar">
        <div className="brand">
          <span className="brand-icon">⚡</span>
          <div>
            <div className="brand-name">LIM PRO</div>
            <div className="brand-sub">CALORIE INTELLIGENCE</div>
          </div>
        </div>
        <div className="today-chip" onClick={() => setTab("tracker")}>
          🔥 {todayCalories} kcal today
        </div>
      </header>

      {/* ── Tab Nav ── */}
      <nav className="tab-nav">
        {[
          { id: "scan", icon: "📷", label: "SCAN" },
          { id: "history", icon: "📋", label: "LOG" },
          { id: "tracker", icon: "📊", label: "TRACKER" },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); if (t.id === "scan") reset(); }}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </nav>

      <main className="main-content">

        {/* ════════ SCAN TAB ════════ */}
        {tab === "scan" && (
          <>
            {/* HOME */}
            {step === "home" && (
              <div className="fade-in">
                {/* Mode selector */}
                <div className="mode-row">
                  {[
                    { id: "camera", icon: "📷", label: "Camera" },
                    { id: "barcode", icon: "▦", label: "Barcode" },
                    { id: "upload", icon: "🖼️", label: "Gallery" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      className={`mode-btn ${scanMode === m.id ? "active" : ""}`}
                      onClick={() => setScanMode(m.id)}
                    >
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>

                {error && <div className="error-box">{error}</div>}

                {scanMode === "camera" && (
                  <Camera onCapture={handleImageReady} />
                )}

                {scanMode === "barcode" && (
                  <BarcodeScanner onResult={handleImageReady} />
                )}

                {scanMode === "upload" && (
                  <div className="upload-zone" onClick={() => fileRef.current.click()}>
                    <div className="upload-icon">🖼️</div>
                    <div className="upload-title">TAP TO UPLOAD</div>
                    <div className="upload-sub">JPG, PNG from your gallery</div>
                    <input
                      ref={fileRef} type="file" accept="image/*"
                      style={{ display: "none" }} onChange={handleUpload}
                    />
                  </div>
                )}

                <div className="hero-chips">
                  {["🔥 Calories", "🍬 Sugar", "💪 Protein", "🚦 WHO Safety", "📊 Macros"].map((c) => (
                    <span key={c} className="chip">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ML SELECTOR */}
            {step === "ml" && (
              <MlSelector
                image={image}
                selectedMl={selectedMl}
                onSelect={setSelectedMl}
                onAnalyze={analyze}
                onBack={reset}
                error={error}
              />
            )}

            {/* LOADING */}
            {step === "loading" && (
              <div className="loading-screen fade-in">
                <div className="spinner" />
                <div className="loading-title">ANALYZING...</div>
                <div className="loading-sub">Reading label · Counting macros · Checking safety</div>
              </div>
            )}

            {/* RESULT */}
            {step === "result" && result && (
              <VerdictCard
                result={result}
                image={image}
                ml={selectedMl}
                onRescan={() => { setStep("ml"); setResult(null); }}
                onNew={reset}
              />
            )}
          </>
        )}

        {/* ════════ HISTORY TAB ════════ */}
        {tab === "history" && (
          <History
            log={todayLog}
            onExport={exportWeeklyReport}
          />
        )}

        {/* ════════ TRACKER TAB ════════ */}
        {tab === "tracker" && (
          <DailyTracker log={todayLog} />
        )}

      </main>
    </div>
  );
}
