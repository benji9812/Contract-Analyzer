# 🔍 Avtal-Analyzern

> Ladda upp ett avtal — AI:n hittar röda flaggor, varningar och förklarar vad du faktiskt skriver under på — på vanlig svenska.

## ✨ Features

- 📄 Ladda upp PDF eller klistra in avtalstext
- 🔴 Röda flaggor med exakta citat och förklaringar
- 🟡 Gula varningar för ovanliga klausuler
- 📊 Övergripande riskpoäng (1–10) med färgkodning
- 📝 Sammanfattning på vanlig svenska
- 📋 Kopiera sammanfattning med ett klick

## 🛠️ Tech Stack

| Del | Teknologi |
|-----|-----------|
| Backend | ASP.NET Core (.NET 9) |
| PDF-parsing | PdfPig |
| AI-analys | Claude API (Anthropic) |
| Frontend | React + TypeScript + Vite |
| HTTP-klient | Axios |

## 🚀 Kom igång

### Förutsättningar

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- Claude API-nyckel från [console.anthropic.com](https://console.anthropic.com)

### 1. Klona repot

```bash
git clone https://github.com/benji9812/Contract-Analyzer.git
cd Contract-Analyzer
```

### 2. Konfigurera miljövariabler

Skapa filen `backend/.env` baserat på mallen:

```bash
cp backend/.env.example backend/.env
```

Öppna `backend/.env` och fyll i din API-nyckel:

CLAUDE_API_KEY=sk-ant-din-nyckel-här
CLAUDE_MODEL=claude-sonnet-4-5


### 3. Installera frontend-paket

```bash
cd frontend
npm install
```

### 4. Starta applikationen

**Via Visual Studio — tryck F5**
Vite dev-servern startar automatiskt och webbläsaren öppnas.

**Via terminal:**

```bash
# Terminal 1 — Backend
cd backend
dotnet run

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Gå till [http://localhost:5173](http://localhost:5173)

## 📁 Projektstruktur

Contract-Analyzer/
├── backend/ # ASP.NET Core Web API
│ ├── Controllers/
│ │ └── ContractController.cs # POST /api/contract/analyze
│ ├── Models/
│ │ ├── AnalysisRequest.cs # Request-modell
│ │ └── AnalysisResult.cs # Response-modell
│ ├── Services/
│ │ ├── ClaudeAnalysisService.cs # AI-integration
│ │ └── PdfParsingService.cs # PDF-textextraktion
│ ├── .env.example # Mall för miljövariabler
│ └── Program.cs
└── frontend/ # React + Vite
└── src/
├── components/
│ ├── AnalysisPanel.tsx # Visar analysresultat
│ ├── FlagCard.tsx # Röd/gul flagga-kort
│ ├── RiskScore.tsx # Riskpoäng med färg
│ └── UploadPanel.tsx # Uppladdning & input
├── services/
│ └── api.ts # API-anrop mot backend
└── types/
└── analysis.ts # TypeScript-typer


## 🔑 Miljövariabler

| Variabel | Beskrivning |
|----------|-------------|
| `CLAUDE_API_KEY` | Din Anthropic API-nyckel |
| `CLAUDE_MODEL` | Modell att använda (default: claude-sonnet-4-5) |

> ⚠️ Pusha aldrig `.env` till GitHub — den är tillagd i `.gitignore`.

## 📜 Licens

MIT