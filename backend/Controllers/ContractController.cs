using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractController(PdfParsingService pdf, ClaudeAnalysisService claude) : ControllerBase
{
    [HttpPost("analyze")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<AnalysisResult>> Analyze([FromForm] AnalysisRequest request)
    {
        string text;

        if (request.File is not null)
        {
            using var stream = request.File.OpenReadStream();
            try
            {
                text = pdf.ExtractText(stream);
            }
            catch (Exception)
            {
                return BadRequest("Kunde inte läsa PDF-filen. Kontrollera att filen är en giltig PDF.");
            }
        }
        else if (!string.IsNullOrWhiteSpace(request.RawText))
        {
            text = request.RawText;
        }
        else
        {
            return BadRequest("Skicka antingen en PDF eller text.");
        }

        if (string.IsNullOrWhiteSpace(text))
            return BadRequest("Ingen text kunde extraheras ur dokumentet.");

        if (text.Length > 50_000)
            text = text[..50_000];

        try
        {
            var result = await claude.AnalyzeAsync(text);
            return Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, $"Fel vid kommunikation med AI-tjänsten: {ex.Message}");
        }
    }
}
