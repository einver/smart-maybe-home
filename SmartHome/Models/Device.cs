using SmartHome.Models.Enums;

namespace SmartHome.Models;

public class Device
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public DeviceType Type { get; set; }

    public ConnectionType ConnectionType { get; set; }
        = ConnectionType.Virtual;

    public string? MqttTopic { get; set; }

    public string? ExternalId { get; set; }

    public Guid RoomId { get; set; }

    public Room Room { get; set; } = null!;

    public Guid UserId { get; set; }

    public string StateJson { get; set; } = "{}";
}