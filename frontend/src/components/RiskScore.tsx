interface RiskScoreProps {
    score: number;
    redCount: number;
    yellowCount: number;
}

function getRiskColor(score: number): string {
    if (score <= 3) return "#16a34a";
    if (score <= 6) return "#d97706";
    return "#dc2626";
}

function getRiskLabel(score: number): string {
    if (score <= 3) return "Låg risk";
    if (score <= 6) return "Medelhög risk";
    return "Hög risk";
}

export function RiskScore({ score, redCount, yellowCount }: RiskScoreProps) {
    const color = getRiskColor(score);
    return (
        <div className="risk-score-container">
            <div className="risk-score-circle" style={{ borderColor: color, color }}>
                <span className="risk-score-number">{score}</span>
                <span className="risk-score-max">/10</span>
            </div>
            <div className="risk-score-info">
                <p className="risk-score-label" style={{ color }}>
                    {getRiskLabel(score)}
                </p>
                <div className="risk-badges">
                    <span className="badge badge-red">🔴 {redCount} röda flaggor</span>
                    <span className="badge badge-yellow">🟡 {yellowCount} varningar</span>
                </div>
            </div>
        </div>
    );
}