namespace SmartHome.Models
{
    public class Scenario
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty;

        public Guid UserId { get; set; }
        public bool IsActive { get; set; }

        public List<Condition> Conditions { get; set; } = new();
        public List<ActionEntity> Actions { get; set; } = new();
        public List<TimeTrigger> TimeTriggers { get; set; } = new();

        public bool SendTelegramNotification { get; set; }

        public string? NotificationText { get; set; }
    }
}