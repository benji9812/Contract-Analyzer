import { useState } from "react";
import type { AnalysisResult } from "./types/analysis";
import { UploadPanel } from "./components/UploadPanel";
import { AnalysisPanel } from "./components/AnalysisPanel";
import "./App.css";

function LoadingState() {
  return (
    <div className="empty-state">
      <div className="loading-spinner" />
      <p className="loading-text">AI analyserar ditt avtal...</p>
    </div>
  );
}

function EmptyState() {
    return (
        <div className="empty-state">
            <span className="empty-state-icon">🔍</span>
            <h2 className="empty-state-title">Redo att analysera</h2>
            <p className="empty-state-desc">
                Ladda upp ett avtal så går AI:n igenom det och hittar röda flaggor,
                ovanliga klausuler och förklarar vad du faktiskt skriver under på —
                på vanlig svenska.
            </p>
            <div className="empty-examples">
                <span>✅ Hyresavtal</span>
                <span>✅ Anställningsavtal</span>
                <span>✅ Köpeavtal</span>
            </div>
        </div>
    );
}

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="app-grid">
      <aside className="upload-col">
        <UploadPanel
          onResult={(r) => { setResult(r); setError(null); }}
          onLoading={setLoading}
          onError={setError}
        />
        {error && (
          <div className="error-banner" role="alert">
            ❌ {error}
          </div>
        )}
      </aside>
      <main className="analysis-col">
        {loading && <LoadingState />}
        {!loading && result && <AnalysisPanel result={result} />}
        {!loading && !result && <EmptyState />}
      </main>
    </div>
  );
}

