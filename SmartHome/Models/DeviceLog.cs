namespace SmartHome.Models
{
    public class DeviceLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid DeviceId { get; set; }

        public Device Device { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public string EventType { get; set; } = string.Empty;
        // STATE_CHANGED
        // MQTT_RECEIVED
        // SCENARIO_ACTION

        public string? Details { get; set; }
    }
}