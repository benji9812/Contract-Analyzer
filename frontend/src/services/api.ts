import axios from "axios";
import type { AnalysisResult } from "../types/analysis";

const BASE = "http://localhost:5057/api";

export async function analyzeContract(
  file?: File,
  rawText?: string
): Promise<AnalysisResult> {
  const form = new FormData();
  if (file) form.append("file", file);
  if (rawText) form.append("rawText", rawText);

  const { data } = await axios.post<AnalysisResult>(
    `${BASE}/contract/analyze`,
    form
  );
  return data;
}
