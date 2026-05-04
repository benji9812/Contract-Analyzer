import type { AnalysisResult } from "../types/analysis";
import { FlagCard } from "./FlagCard";
import { RiskScore } from "./RiskScore";

interface AnalysisPanelProps {
  result: AnalysisResult;
}

export function AnalysisPanel({ result }: AnalysisPanelProps) {
  return (
    <div className="analysis-panel">
      <div className="analysis-header">
              <RiskScore
                  score={result.riskScore}
                  redCount={result.redFlags.length}
                  yellowCount={result.yellowWarnings.length}
              />
        <div className="analysis-badges">
          {result.redFlags.length > 0 && (
            <span className="badge badge--red">
              🚨 {result.redFlags.length} röd{result.redFlags.length !== 1 ? "a" : ""} flagg{result.redFlags.length !== 1 ? "or" : "a"}
            </span>
          )}
          {result.yellowWarnings.length > 0 && (
            <span className="badge badge--yellow">
              ⚠️ {result.yellowWarnings.length} gul{result.yellowWarnings.length !== 1 ? "a" : ""} varning{result.yellowWarnings.length !== 1 ? "ar" : ""}
            </span>
          )}
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-header">
          <h2>Sammanfattning</h2>
          <button
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(result.summary)}
            title="Kopiera sammanfattning"
          >
            📋 Kopiera
          </button>
        </div>
        <p className="summary-text">{result.summary}</p>
      </div>

      {result.redFlags.length > 0 && (
        <div className="flags-section">
          <h2 className="flags-title flags-title--red">🚨 Röda flaggor</h2>
          {result.redFlags.map((flag, i) => (
            <FlagCard key={i} flag={flag} type="red" />
          ))}
        </div>
      )}

      {result.yellowWarnings.length > 0 && (
        <div className="flags-section">
          <h2 className="flags-title flags-title--yellow">⚠️ Gula varningar</h2>
          {result.yellowWarnings.map((flag, i) => (
            <FlagCard key={i} flag={flag} type="yellow" />
          ))}
        </div>
      )}
    </div>
  );
}
