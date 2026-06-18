using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;

using SmartHome.Data;
using SmartHome.Models;

using Microsoft.EntityFrameworkCore;

namespace SmartHome.Services;

public class MqttService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    private IMqttClient _client = null!;

    public MqttService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new MqttFactory();

        _client = factory.CreateMqttClient();

        var options = new MqttClientOptionsBuilder()
            .WithTcpServer("localhost", 1883)
            .Build();

        _client.ApplicationMessageReceivedAsync += async e =>
        {
            await HandleMessage(e);
        };

        try
        {
            await _client.ConnectAsync(options, stoppingToken);

            await _client.SubscribeAsync("smarthome/#");
            await _client.SubscribeAsync("zigbee2mqtt/#");

            Console.WriteLine("MQTT connected");
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"MQTT unavailable: {ex.Message}");
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(1000, stoppingToken);
        }
    }

    private async Task HandleMessage(MqttApplicationMessageReceivedEventArgs e)
    {
        var topic = e.ApplicationMessage.Topic;

        var payload = System.Text.Encoding.UTF8.GetString(
            e.ApplicationMessage.PayloadSegment);

        using var scope = _scopeFactory.CreateScope();

        var db = scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

        var scenarioService =
            scope.ServiceProvider
                .GetRequiredService<ScenarioService>();

        var device = await db.Devices
            .FirstOrDefaultAsync(d =>
                topic == d.MqttTopic
                || topic == d.MqttTopic + "/state");

        if (device == null)
            return;

        device.StateJson = payload;

        // Событие для сценариев
        var deviceEvent = new DeviceEvent
        {
            DeviceId = device.Id,
            Type = "MQTT_STATE",
            ValueJson = payload,
            CreatedAt = DateTime.UtcNow
        };

        db.DeviceEvents.Add(deviceEvent);

        db.DeviceLogs.Add(
            new DeviceLog
            {
                DeviceId = device.Id,
                CreatedAt = DateTime.UtcNow,
                EventType = "MQTT_STATE",
                Details = payload
            });

        // Новый журнал устройств
        db.DeviceLogs.Add(
            new DeviceLog
            {
                DeviceId = device.Id,
                CreatedAt = DateTime.UtcNow,
                EventType = "STATE_CHANGED",
                Details = payload
            });

        await db.SaveChangesAsync();

        await scenarioService.HandleDeviceEvent(deviceEvent);

        Console.WriteLine(
            $"MQTT: {device.Name} => {payload}");
    }

    public async Task PublishAsync(string topic, string payload)
    {
        if (!_client.IsConnected)
            return;

        Console.WriteLine($"MQTT SEND: {topic}");
        Console.WriteLine(payload);

        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
            .Build();

        

        await _client.PublishAsync(message);
    }
}