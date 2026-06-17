namespace SmartHome.Models
{
    public class TimeTrigger
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ScenarioId { get; set; }
        public Scenario Scenario { get; set; } = null!;

        public TimeSpan Time { get; set; }
        public string DaysOfWeek { get; set; } = string.Empty;
    }
}