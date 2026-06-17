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
    public class ConditionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConditionsController(AppDbContext context)
        {
            _context = context;
        }

        // Получить условия сценария
        [HttpGet("{scenarioId}")]
        public async Task<IActionResult> GetByScenario(Guid scenarioId)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var conditions = await _context.Conditions
                .Where(c => c.ScenarioId == scenarioId &&
                            _context.Scenarios.Any(s => s.Id == scenarioId && s.UserId == userId))
                .ToListAsync();

            return Ok(conditions);
        }

        // Добавить условие
        [HttpPost]
        public async Task<IActionResult> Create(AddConditionDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var scenarioExists = await _context.Scenarios
                .AnyAsync(s => s.Id == dto.ScenarioId && s.UserId == userId);

            if (!scenarioExists)
                return BadRequest("Invalid scenario");

            var condition = new Condition
            {
                ScenarioId = dto.ScenarioId,
                DeviceId = dto.DeviceId,
                Parameter = dto.Parameter,
                Operator = dto.Operator,
                Value = dto.Value,
                LogicalOperator = dto.LogicalOperator
            };

            _context.Conditions.Add(condition);

            await _context.SaveChangesAsync();

            return Ok(condition);
        }

        // Удалить условие
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var condition = await _context.Conditions.FindAsync(id);

            if (condition == null)
                return NotFound();

            _context.Conditions.Remove(condition);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}