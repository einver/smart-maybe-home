namespace SmartHome.DTOs
{
    public class AddConditionDto
    {
        public Guid ScenarioId { get; set; }

        public Guid DeviceId { get; set; }

        public string Parameter { get; set; } = string.Empty;

        public string Operator { get; set; } = "=";

        public string Value { get; set; } = string.Empty;

        public string LogicalOperator { get; set; } = "AND";
    }
}