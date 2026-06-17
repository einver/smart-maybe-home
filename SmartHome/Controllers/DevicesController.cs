using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHome.Data;
using SmartHome.Models;
using System.Security.Claims;
using SmartHome.DTOs;
using Microsoft.EntityFrameworkCore;
using SmartHome.Services;
using SmartHome.Models.Enums;



namespace SmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DevicesController : ControllerBase
    {
        private readonly AppDbContext _context;


        //private readonly ScenarioEngine _scenarioEngine;

        private readonly ScenarioService _scenarioService;

        private readonly MqttService _mqttService;


        public DevicesController(AppDbContext context, /*ScenarioEngine scenarioEngine*/ ScenarioService scenarioService, MqttService mqttService)
        {
            _context = context;
            //_scenarioEngine = scenarioEngine;
            _scenarioService = scenarioService;
            _mqttService = mqttService;
        }


        // Получить все устройства пользователя
        [HttpGet]
        public IActionResult GetDevices()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var devices = _context.Devices
                .Where(d => d.UserId == userId)
                .ToList();

            return Ok(devices);
        }

        //Получить устройства по комнате
        [HttpGet("room/{roomId}")]
        public IActionResult GetDevicesByRoom(Guid roomId)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var devices = _context.Devices
                .Where(d => d.RoomId == roomId && d.UserId == userId)
                .ToList();

            return Ok(devices);
        }

        // Добавить устройство
        [HttpPost]
        public async Task<IActionResult> CreateDevice([FromBody] CreateDeviceDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var roomExists = _context.Rooms
                .Any(r => r.Id == dto.RoomId && r.UserId == userId);

            if (!roomExists)
                return BadRequest("Invalid room");

            // парсинг string в enum
            if (!Enum.TryParse<DeviceType>(dto.Type, true, out var deviceType))
                return BadRequest("Invalid device type");

            string defaultState = deviceType switch
            {
                DeviceType.Lamp => "{\"power\": false}",
                DeviceType.AC => "{\"power\": false, \"targetTemp\": 24}",
                DeviceType.Sensor => "{}",
                DeviceType.Heater => "{\"power\": false}",
                DeviceType.Motor => "{\"open\": false}",
                _ => "{}"
            };

            var device = new Device
            {
                Name = dto.Name,
                Type = deviceType,
                RoomId = dto.RoomId,
                UserId = userId,
                StateJson = defaultState,

                ConnectionType = dto.ConnectionType,

                MqttTopic = dto.MqttTopic,

                ExternalId = dto.ExternalId
            };

            _context.Devices.Add(device);
            await _context.SaveChangesAsync();

            return Ok(device);
        }

        // Обновить состояние устройства
        [HttpPut("{id}/state")]
        public async Task<IActionResult> UpdateState(
            Guid id,
            [FromBody] UpdateDeviceStateDto dto)
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var device = await _context.Devices
                .FirstOrDefaultAsync(d =>
                    d.Id == id &&
                    d.UserId == userId);

            if (device == null)
                return NotFound();

            // MQTT publish для реальных устройств
            if (
                device.ConnectionType is ConnectionType.MQTT
                or ConnectionType.Zigbee
                &&
                !string.IsNullOrWhiteSpace(device.MqttTopic)
            )
            {
                try
                {
                    // state -> set
                    var setTopic = $"{device.MqttTopic}/set";

                    await _mqttService.PublishAsync(
                        setTopic,
                        dto.StateJson);

                    Console.WriteLine(
                        $"MQTT SEND: {setTopic} => {dto.StateJson}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine(
                        $"MQTT ERROR: {ex.Message}");
                }
            }

            // обновление state
            device.StateJson = dto.StateJson;

            var deviceEvent = new DeviceEvent
            {
                DeviceId = device.Id,
                Type = "STATE_CHANGED",
                ValueJson = dto.StateJson,
                CreatedAt = DateTime.UtcNow
            };

            _context.DeviceEvents.Add(deviceEvent);

            _context.DeviceLogs.Add(
                new DeviceLog
                {
                    DeviceId = device.Id,
                    CreatedAt = DateTime.UtcNow,
                    EventType = "UI_STATE_CHANGED",
                    Details = dto.StateJson
                });

            await _context.SaveChangesAsync();

            // сценарии
            await _scenarioService.HandleDeviceEvent(deviceEvent);

            return Ok(device);
        }


        // Удалить устройство
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(Guid id)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var device = await _context.Devices
                .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);

            if (device == null)
                return NotFound();

            _context.Devices.Remove(device);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}