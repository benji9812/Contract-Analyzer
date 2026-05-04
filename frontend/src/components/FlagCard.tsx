import type { ContractFlag } from "../types/analysis";

interface FlagCardProps {
  flag: ContractFlag;
  type: "red" | "yellow";
}

export function FlagCard({ flag, type }: FlagCardProps) {
  return (
    <div className={`flag-card flag-card--${type}`}>
      <blockquote className="flag-quote">"{flag.quote}"</blockquote>
      <p className="flag-explanation">{flag.explanation}</p>
      {flag.pageHint && <span className="flag-hint">{flag.pageHint}</span>}
    </div>
  );
}
