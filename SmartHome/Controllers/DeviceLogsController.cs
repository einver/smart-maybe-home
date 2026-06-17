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
    public class DeviceLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeviceLogsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var userId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)!.Value
            );

            var logs = await _context.DeviceLogs
                .Include(l => l.Device)
                .Where(l => l.Device.UserId == userId)
                .OrderByDescending(l => l.CreatedAt)
                .Take(100)
                .ToListAsync();

            return Ok(logs);
        }
    }
}