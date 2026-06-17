using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.Models;
using System.Text.Json;

namespace SmartHome.Services
{
    public class ScenarioService
    {
        private readonly AppDbContext _context;
        private readonly MqttService _mqttService;
        private readonly TelegramBotService _telegram;

        public ScenarioService(
            AppDbContext context,
            MqttService mqttService,
            TelegramBotService telegram)
        {
            _context = context;
            _mqttService = mqttService;
            _telegram = telegram;
        }

        public async Task HandleDeviceEvent(DeviceEvent deviceEvent)
        {
            var device = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == deviceEvent.DeviceId);

            if (device == null)
                return;

            var scenarios = await _context.Scenarios
                .Include(s => s.Conditions)
                .Include(s => s.Actions)
                .Where(s => s.UserId == device.UserId && s.IsActive)
                .ToListAsync();

            foreach (var scenario in scenarios)
            {
                if (CheckConditions(scenario, deviceEvent))
                {
                    if (!NeedExecuteActions(scenario))
                    {
                        Console.WriteLine(
                            $"SCENARIO SKIPPED: {scenario.Name} (state already applied)");

                        continue;
                    }

                    Console.WriteLine(
                        $"SCENARIO TRIGGERED: {scenario.Name}");

                    await ExecuteActions(scenario);

                    try
                    {
                        await SendTelegramNotification(scenario);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(
                            $"Telegram error: {ex.Message}");
                    }

                    _context.ScenarioLogs.Add(new ScenarioLog
                    {
                        Id = Guid.NewGuid(),
                        ScenarioId = scenario.Id,
                        ExecutedAt = DateTime.UtcNow,
                        TriggerType = "EVENT",
                        Details = deviceEvent.ValueJson
                    });

                    await _context.SaveChangesAsync();
                }
            }
        }

        private bool CheckConditions(
            Scenario scenario,
            DeviceEvent deviceEvent)
        {
            if (scenario.Conditions == null || !scenario.Conditions.Any())
                return false;

            foreach (var condition in scenario.Conditions)
            {
                string json;

                // Условие относится к устройству,
                // которое вызвало событие
                if (condition.DeviceId == deviceEvent.DeviceId)
                {
                    json = deviceEvent.ValueJson;
                }
                else
                {
                    // Берём текущее состояние другого устройства
                    var device = _context.Devices
                        .FirstOrDefault(d => d.Id == condition.DeviceId);

                    if (device == null)
                        return false;

                    json = device.StateJson;
                }

                var dict =
                    JsonSerializer.Deserialize<
                        Dictionary<string, JsonElement>>(json);

                if (dict == null)
                    return false;

                if (!dict.TryGetValue(
                        condition.Parameter,
                        out var value))
                {
                    Console.WriteLine(
                        $"PARAMETER NOT FOUND: {condition.Parameter}");

                    return false;
                }

                var actualValue = value.ToString();

                Console.WriteLine(
                    $"CHECK DEVICE {condition.DeviceId}");

                Console.WriteLine(
                    $"{condition.Parameter}: {actualValue} " +
                    $"{condition.Operator} {condition.Value}");

                if (!Compare(
                        actualValue,
                        condition.Operator,
                        condition.Value))
                {
                    return false;
                }
            }

            return true;
        }

        private bool Compare(string? actual, string op, string expected)
        {
            if (actual == null)
                return false;

            actual = actual.Replace(",", ".");
            expected = expected.Replace(",", ".");

            if (double.TryParse(
                    actual,
                    System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var actualNum)
                &&
                double.TryParse(
                    expected,
                    System.Globalization.NumberStyles.Any,
                    System.Globalization.CultureInfo.InvariantCulture,
                    out var expectedNum))
            {
                return op switch
                {
                    ">" => actualNum > expectedNum,
                    "<" => actualNum < expectedNum,
                    ">=" => actualNum >= expectedNum,
                    "<=" => actualNum <= expectedNum,

                    "GreaterThan" => actualNum > expectedNum,
                    "LessThan" => actualNum < expectedNum,
                    "GreaterOrEqual" => actualNum >= expectedNum,
                    "LessOrEqual" => actualNum <= expectedNum,

                    "=" => actualNum == expectedNum,
                    "!=" => actualNum != expectedNum,

                    _ => false
                };
            }

            actual = actual.ToLower();
            expected = expected.ToLower();

            return op switch
            {
                "=" => actual == expected,
                "!=" => actual != expected,
                _ => false
            };
        }

        private async Task ExecuteActions(Scenario scenario)
        {
            foreach (var action in scenario.Actions)
            {
                var device = await _context.Devices
                    .FirstOrDefaultAsync(d => d.Id == action.DeviceId);

                if (device == null)
                    continue;

                Dictionary<string, object> currentState;

                try
                {
                    currentState =
                        JsonSerializer.Deserialize<Dictionary<string, object>>(
                            device.StateJson ?? "{}")
                        ?? new();
                }
                catch
                {
                    currentState = new();
                }

                Dictionary<string, JsonElement>? newState = null;

                try
                {
                    newState =
                        JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(
                            action.Value);
                }
                catch
                {
                    Console.WriteLine("INVALID ACTION JSON");
                    continue;
                }

                if (newState != null)
                {
                    foreach (var kv in newState)
                    {
                        currentState[kv.Key] = kv.Value;
                    }
                }

                device.StateJson =
                    JsonSerializer.Serialize(currentState);

                await _context.SaveChangesAsync();

                //await SendTelegramNotification(scenario);

                Console.WriteLine(
                    $"DEVICE STATE UPDATED: {device.Name} => {device.StateJson}");

                // MQTT publish
                if (!string.IsNullOrWhiteSpace(device.MqttTopic))
                {
                    var topic = $"{device.MqttTopic}/set";

                    var payload = device.StateJson;

                    Console.WriteLine($"MQTT SEND: {topic}");
                    Console.WriteLine(payload);

                    await _mqttService.PublishAsync(topic, payload);
                }
            }
        }

        private async Task SendTelegramNotification(
            Scenario scenario)
        {
            if (!scenario.SendTelegramNotification)
                return;

            var user = await _context.Users
                .FirstOrDefaultAsync(x =>
                    x.Id == scenario.UserId);

            if (user == null)
                return;

            if (user.TelegramChatId == null)
                return;

            var text =
                string.IsNullOrWhiteSpace(
                    scenario.NotificationText)
                ? $"Сценарий '{scenario.Name}' выполнен"
                : scenario.NotificationText;

            await _telegram.SendMessage(
                user.TelegramChatId.Value,
                text);
        }
        private bool NeedExecuteActions(
            Scenario scenario)
        {
            foreach (var action in scenario.Actions)
            {
                var device = _context.Devices
                    .FirstOrDefault(d =>
                        d.Id == action.DeviceId);

                if (device == null)
                    continue;

                try
                {
                    var currentState =
                        JsonSerializer.Deserialize<
                            Dictionary<string, JsonElement>>(
                            device.StateJson);

                    var desiredState =
                        JsonSerializer.Deserialize<
                            Dictionary<string, JsonElement>>(
                            action.Value);

                    if (currentState == null ||
                        desiredState == null)
                    {
                        return true;
                    }

                    foreach (var kv in desiredState)
                    {
                        if (!currentState.TryGetValue(
                                kv.Key,
                                out var currentValue))
                        {
                            return true;
                        }

                        if (currentValue.ToString() !=
                            kv.Value.ToString())
                        {
                            return true;
                        }
                    }
                }
                catch
                {
                    return true;
                }
            }

            return false;
        }
    }
}