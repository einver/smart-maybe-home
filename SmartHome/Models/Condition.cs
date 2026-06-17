namespace SmartHome.Models
{

    public class Condition
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ScenarioId { get; set; }
        public Scenario Scenario { get; set; } = null!;

        public Guid DeviceId { get; set; }

        public string Parameter { get; set; } = string.Empty;
        public string Operator { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string LogicalOperator { get; set; } = "AND"; // AND / OR
    }
}