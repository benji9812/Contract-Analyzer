namespace backend.Models;

public class AnalysisResult
{
    public string Summary { get; set; } = string.Empty;
    public int RiskScore { get; set; }
    public List<ContractFlag> RedFlags { get; set; } = [];
    public List<ContractFlag> YellowWarnings { get; set; } = [];
}

public class ContractFlag
{
    public string Quote { get; set; } = string.Empty;
    public string Explanation { get; set; } = string.Empty;
    public string? PageHint { get; set; }
}
