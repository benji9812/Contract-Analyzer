export interface ContractFlag {
  quote: string;
  explanation: string;
  pageHint?: string;
}

export interface AnalysisResult {
  summary: string;
  riskScore: number;
  redFlags: ContractFlag[];
  yellowWarnings: ContractFlag[];
}
