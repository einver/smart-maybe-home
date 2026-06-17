namespace SmartHome.Models
{
    public class ScenarioLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ScenarioId { get; set; }
        public Scenario Scenario { get; set; } = null!;

        public DateTime ExecutedAt { get; set; }

        public string TriggerType { get; set; } = string.Empty;
        // EVENT / TIME

        public string? Details { get; set; }
        // можно хранить JSON с инфой
    }
}