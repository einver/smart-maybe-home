namespace SmartHome.DTOs
{
    public class AddActionDto
    {
        public Guid ScenarioId { get; set; }

        public Guid DeviceId { get; set; }

        public string ActionType { get; set; } = "SET_STATE";

        public string Value { get; set; } = string.Empty;
    }
}