using SmartHome.Models.Enums;

namespace SmartHome.DTOs
{
    public class CreateDeviceDto
    {
        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public Guid RoomId { get; set; }

        public ConnectionType ConnectionType { get; set; }

        public string? MqttTopic { get; set; }

        public string? ExternalId { get; set; }
    }
}