import { useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import type { AnalysisResult } from "../types/analysis";
import { analyzeContract } from "../services/api";

interface UploadPanelProps {
    onResult: (result: AnalysisResult) => void;
    onLoading: (loading: boolean) => void;
    onError: (error: string | null) => void;
}

export function UploadPanel({ onResult, onLoading, onError }: UploadPanelProps) {
    const [file, setFile] = useState<File | null>(null);
    const [rawText, setRawText] = useState("");
    const [mode, setMode] = useState<"file" | "text">("file");
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && selected.size > 10_000_000) {
            onError("Filen är för stor. Max 10 MB.");
            return;
        }
        setFile(selected);
        onError(null);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (!dropped) return;
        if (dropped.type !== "application/pdf") {
            onError("Endast PDF-filer stöds.");
            return;
        }
        if (dropped.size > 10_000_000) {
            onError("Filen är för stor. Max 10 MB.");
            return;
        }
        setFile(dropped);
        onError(null);
    };

    const handleSubmit = async () => {
        if (mode === "file" && !file) {
            onError("Välj en PDF-fil att analysera.");
            return;
        }
        if (mode === "text" && !rawText.trim()) {
            onError("Klistra in eller skriv avtalstext för att analysera.");
            return;
        }

        onError(null);
        setLoading(true);
        onLoading(true);

        try {
            const result = await analyzeContract(
                mode === "file" ? (file ?? undefined) : undefined,
                mode === "text" ? rawText : undefined
            );
            onResult(result);
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Något gick fel. Försök igen.";
            onError(message);
        } finally {
            setLoading(false);
            onLoading(false);
        }
    };

    return (
        <div className="upload-panel">
            <div className="upload-logo">
                <span className="upload-logo-icon">📄</span>
                <h1 className="upload-logo-title">Avtal-Analyzern</h1>
            </div>
            <p className="upload-subtitle">
                Ladda upp ett avtal — AI:n hittar riskerna åt dig.
            </p>

            <div className="mode-tabs">
                <button
                    className={`mode-tab ${mode === "file" ? "mode-tab--active" : ""}`}
                    onClick={() => setMode("file")}
                    disabled={loading}
                >
                    PDF-fil
                </button>
                <button
                    className={`mode-tab ${mode === "text" ? "mode-tab--active" : ""}`}
                    onClick={() => setMode("text")}
                    disabled={loading}
                >
                    Klistra in text
                </button>
            </div>

            {mode === "file" ? (
                <div
                    className={`dropzone ${dragging ? "dropzone--active" : ""} ${file ? "dropzone--has-file" : ""}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => !loading && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    {file ? (
                        <>
                            <span className="dropzone-icon">✅</span>
                            <p className="dropzone-filename">{file.name}</p>
                            <p className="dropzone-hint">Klicka för att byta fil</p>
                        </>
                    ) : (
                        <>
                            <span className="dropzone-icon">📎</span>
                            <p className="dropzone-text">Dra och släpp PDF här</p>
                            <p className="dropzone-hint">eller klicka för att välja fil</p>
                        </>
                    )}
                </div>
            ) : (
                <textarea
                    className="text-input"
                    placeholder="Klistra in din avtalstext här..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={10}
                    disabled={loading}
                />
            )}

            {loading && (
                <div className="loading-state">
                    <div className="spinner" />
                    <p>AI analyserar ditt avtal...</p>
                </div>
            )}

            {!loading && (
                <button
                    className="analyze-btn"
                    onClick={handleSubmit}
                    disabled={mode === "file" ? !file : !rawText.trim()}
                >
                    Analysera avtal
                </button>
            )}
        </div>
    );
}