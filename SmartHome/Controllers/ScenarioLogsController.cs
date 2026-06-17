using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using System.Security.Claims;

namespace SmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ScenarioLogsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScenarioLogsController(AppDbContext context)
        {
            _context = context;
        }

        // все логи пользователя
        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var logs = await _context.ScenarioLogs
                .Include(l => l.Scenario)
                .Where(l => l.Scenario.UserId == userId)
                .OrderByDescending(l => l.ExecutedAt)
                .Take(100)
                .ToListAsync();

            return Ok(logs);
        }

        // логи конкретного сценария
        [HttpGet("scenario/{scenarioId}")]
        public async Task<IActionResult> GetScenarioLogs(Guid scenarioId)
        {
            var logs = await _context.ScenarioLogs
                .Where(l => l.ScenarioId == scenarioId)
                .OrderByDescending(l => l.ExecutedAt)
                .ToListAsync();

            return Ok(logs);
        }
    }
}