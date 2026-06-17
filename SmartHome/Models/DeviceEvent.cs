namespace SmartHome.Models
{

    public class DeviceEvent
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid DeviceId { get; set; }
        public Device Device { get; set; } = null!;

        public string Type { get; set; } = string.Empty;
        public string ValueJson { get; set; } = "{}";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}