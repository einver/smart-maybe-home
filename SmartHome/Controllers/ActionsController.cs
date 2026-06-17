using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.Models;
using System.Security.Claims;
using SmartHome.DTOs;

namespace SmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ActionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ActionsController(AppDbContext context)
        {
            _context = context;
        }

        // Получить actions сценария
        [HttpGet("{scenarioId}")]
        public async Task<IActionResult> GetActions(Guid scenarioId)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var actions = await _context.Actions
                .Where(a => a.ScenarioId == scenarioId &&
                            _context.Scenarios.Any(s => s.Id == scenarioId && s.UserId == userId))
                .ToListAsync();

            return Ok(actions);
        }

        // Добавить action
        [HttpPost]
        public async Task<IActionResult> CreateAction([FromBody] AddActionDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var scenarioExists = await _context.Scenarios
                .AnyAsync(s => s.Id == dto.ScenarioId && s.UserId == userId);

            if (!scenarioExists)
                return BadRequest("Invalid scenario");

            var action = new ActionEntity
            {
                ScenarioId = dto.ScenarioId,
                DeviceId = dto.DeviceId,
                ActionType = dto.ActionType,
                Value = dto.Value
            };

            _context.Actions.Add(action);

            await _context.SaveChangesAsync();

            return Ok(action);
        }

        // Удалить action
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAction(Guid id)
        {
            var action = await _context.Actions.FindAsync(id);

            if (action == null)
                return NotFound();

            _context.Actions.Remove(action);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}