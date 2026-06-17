using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHome.Data;
using SmartHome.Models;
using System.Security.Claims;
using SmartHome.DTOs;
using Microsoft.EntityFrameworkCore;

namespace SmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DeviceEventsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeviceEventsController(AppDbContext context)
        {
            _context = context;
        }

        // Получить события устройства
        [HttpGet("device/{deviceId}")]
        public IActionResult GetEventsByDevice(Guid deviceId)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var events = _context.DeviceEvents
                .Where(e => e.DeviceId == deviceId &&
                            _context.Devices.Any(d => d.Id == deviceId && d.UserId == userId))
                .OrderByDescending(e => e.CreatedAt)
                .ToList();

            return Ok(events);
        }

    }
}