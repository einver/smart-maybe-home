namespace SmartHome.Models
{
    public class ActionEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ScenarioId { get; set; }
        public Scenario Scenario { get; set; } = null!;

        public Guid DeviceId { get; set; }

        public string ActionType { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
    }
}