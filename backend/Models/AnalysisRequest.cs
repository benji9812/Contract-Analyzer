namespace backend.Models;

public class AnalysisRequest
{
    public IFormFile? File { get; set; }
    public string? RawText { get; set; }
}
