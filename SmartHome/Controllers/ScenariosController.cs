using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.Models;
using SmartHome.DTOs;
using System.Security.Claims;

namespace SmartHome.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ScenariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScenariosController(AppDbContext context)
        {
            _context = context;
        }

        // Получить все сценарии пользователя
        [HttpGet]
        public async Task<IActionResult> GetScenarios()
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var scenarios = await _context.Scenarios
                .Include(s => s.Conditions)
                .Include(s => s.Actions)
                .Include(s => s.TimeTriggers)
                .Where(s => s.UserId == userId)
                .ToListAsync();

            return Ok(scenarios);
        }

        // Создать сценарий
        [HttpPost]
        public async Task<IActionResult> CreateScenario(CreateScenarioDto dto)
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var scenario = new Scenario
            {
                Name = dto.Name,
                UserId = userId,
                IsActive = true
            };

            _context.Scenarios.Add(scenario);
            await _context.SaveChangesAsync();

            return Ok(scenario);
        }

        // Добавить условие
        [HttpPost("{scenarioId}/conditions")]
        public async Task<IActionResult> AddCondition(Guid scenarioId, AddConditionDto dto)
        {
            var scenario = await _context.Scenarios.FindAsync(scenarioId);
            if (scenario == null)
                return NotFound();

            var condition = new Condition
            {
                ScenarioId = scenarioId,
                DeviceId = dto.DeviceId,
                Parameter = dto.Parameter,
                Operator = dto.Operator,
                Value = dto.Value
            };

            _context.Conditions.Add(condition);
            await _context.SaveChangesAsync();

            return Ok(condition);
        }

        // Добавить действие
        [HttpPost("{scenarioId}/actions")]
        public async Task<IActionResult> AddAction(Guid scenarioId, AddActionDto dto)
        {
            var scenario = await _context.Scenarios.FindAsync(scenarioId);
            if (scenario == null)
                return NotFound();

            var action = new ActionEntity
            {
                ScenarioId = scenarioId,
                DeviceId = dto.DeviceId,
                ActionType = dto.ActionType,
                Value = dto.Value
            };

            _context.Actions.Add(action);
            await _context.SaveChangesAsync();

            return Ok(action);
        }

        // Добавить TimeTrigger
        [HttpPost("{scenarioId}/time")]
        public async Task<IActionResult> AddTimeTrigger(Guid scenarioId, AddTimeTriggerDto dto)
        {
            var scenario = await _context.Scenarios.FindAsync(scenarioId);
            if (scenario == null)
                return NotFound();

            var trigger = new TimeTrigger
            {
                ScenarioId = scenarioId,
                Time = dto.Time,
                DaysOfWeek = dto.DaysOfWeek
            };

            _context.TimeTriggers.Add(trigger);
            await _context.SaveChangesAsync();

            return Ok(trigger);
        }

        // Включить / выключить сценарий
        [HttpPut("{scenarioId}/toggle")]
        public async Task<IActionResult> ToggleScenario(Guid scenarioId)
        {
            var scenario = await _context.Scenarios.FindAsync(scenarioId);
            if (scenario == null)
                return NotFound();

            scenario.IsActive = !scenario.IsActive;

            await _context.SaveChangesAsync();

            return Ok(scenario);
        }

        // Удалить сценарий
        [HttpDelete("{scenarioId}")]
        public async Task<IActionResult> DeleteScenario(Guid scenarioId)
        {
            var scenario = await _context.Scenarios.FindAsync(scenarioId);
            if (scenario == null)
                return NotFound();

            _context.Scenarios.Remove(scenario);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var scenario = await _context.Scenarios
                .FirstOrDefaultAsync(x => x.Id == id);

            if (scenario == null)
                return NotFound();

            return Ok(new
            {
                scenario.Id,
                scenario.Name,
                scenario.IsActive,
                scenario.SendTelegramNotification,
                scenario.NotificationText
            });
        }
        [HttpPut("{id}/notifications")]
        public async Task<IActionResult> UpdateNotifications(
            Guid id,
            UpdateScenarioNotificationsDto dto)
        {
            var scenario = await _context.Scenarios
                .FirstOrDefaultAsync(x => x.Id == id);

            if (scenario == null)
                return NotFound();

            scenario.SendTelegramNotification =
                dto.SendTelegramNotification;

            scenario.NotificationText =
                dto.NotificationText;

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
    