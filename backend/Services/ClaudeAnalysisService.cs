using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using backend.Models;

namespace backend.Services;

public class ClaudeAnalysisService(IConfiguration config, HttpClient http)
{
    private readonly string _apiKey = config["Claude:ApiKey"] ?? string.Empty;
    private readonly string _model = config["Claude:Model"] ?? "claude-sonnet-4-5";

    public async Task<AnalysisResult> AnalyzeAsync(string contractText)
    {
        var prompt = BuildPrompt(contractText);

        var requestBody = new
        {
            model = _model,
            max_tokens = 4096,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
        requestMessage.Headers.Add("x-api-key", _apiKey);
        requestMessage.Headers.Add("anthropic-version", "2023-06-01");
        requestMessage.Content = content;

        var response = await http.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(responseJson);
        var textContent = doc.RootElement
            .GetProperty("content")[0]
            .GetProperty("text")
            .GetString() ?? "{}";

        // Strip markdown code fences if present
        var cleaned = textContent.Trim();
        if (cleaned.StartsWith("```"))
        {
            var firstNewline = cleaned.IndexOf('\n');
            var lastFence = cleaned.LastIndexOf("```");
            if (firstNewline >= 0 && lastFence > firstNewline)
                cleaned = cleaned[(firstNewline + 1)..lastFence].Trim();
        }

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };
            return JsonSerializer.Deserialize<AnalysisResult>(cleaned, options)
                   ?? new AnalysisResult { Summary = "Kunde inte tolka svaret.", RiskScore = 5 };
        }
        catch (JsonException)
        {
            return new AnalysisResult
            {
                Summary = "Analysen returnerade ogiltigt format. Försök igen.",
                RiskScore = 5
            };
        }
    }

    private string BuildPrompt(string text) => $$"""
        Du är en juridisk assistent som analyserar svenska avtal.

        Analysera följande avtalstext och returnera EXAKT detta JSON-format:
        {
          "summary": "sammanfattning på vanlig svenska av vad användaren faktiskt går med på",
          "riskScore": <heltal 1-10>,
          "redFlags": [
            { "quote": "exakt citat ur texten", "explanation": "förklaring på svenska", "pageHint": "om möjligt" }
          ],
          "yellowWarnings": [
            { "quote": "exakt citat", "explanation": "förklaring", "pageHint": null }
          ]
        }

        Röda flaggor = klausuler som är direkt riskabla eller ovanliga till användarens nackdel.
        Gula varningar = klausuler som är ovanliga men inte nödvändigtvis farliga.
        Citera ALLTID exakt ur texten. Svara BARA med JSON, inget annat.

        AVTALSTEXT:
        {{text}}
        """;
}
