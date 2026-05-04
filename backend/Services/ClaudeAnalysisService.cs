using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class ClaudeAnalysisService(IConfiguration config, HttpClient http)
{
    private readonly string _apiKey = config["Claude:ApiKey"] ?? string.Empty;
    private readonly string _model = config["Claude:Model"] ?? "claude-haiku-4-5-20251001";

    public async Task<AnalysisResult> AnalyzeAsync(string contractText)
    {
        var prompt = BuildPrompt(contractText);

        var requestBody = new
        {
            model = _model,
            max_tokens = 1024,
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
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
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
        Analysera detta avtal. Svara ENDAST med JSON, inga förklaringar.
        {"summary":"kort sammanfattning på svenska","riskScore":1-10,"redFlags":[{"quote":"citat","explanation":"förklaring","pageHint":null}],"yellowWarnings":[{"quote":"citat","explanation":"förklaring","pageHint":null}]}
        Max 5 röda flaggor, max 5 gula varningar. Bara de viktigaste.
        AVTAL:
        {{text}}
        """;
}