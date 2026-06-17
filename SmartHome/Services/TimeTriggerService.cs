using Microsoft.EntityFrameworkCore;
using SmartHome.Data;
using SmartHome.Models;

namespace SmartHome.Services
{
    public class TimeTriggerService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        private readonly Dictionary<Guid, DateTime> _lastRun = new();

        public TimeTriggerService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckTriggers();
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        private async Task CheckTriggers()
        {
            using var scope = _serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var now = DateTime.UtcNow;

            var triggers = await context.TimeTriggers
                .Include(t => t.Scenario)
                .ThenInclude(s => s.Actions)
                .Where(t => t.Scenario.IsActive)
                .ToListAsync();

            foreach (var trigger in triggers)
            {
                // защита от повторного запуска
                if (_lastRun.TryGetValue(trigger.Id, out var lastRunTime))
                {
                    if (lastRunTime.Date == now.Date &&
                        lastRunTime.Hour == now.Hour &&
                        lastRunTime.Minute == now.Minute)
                        continue;
                }

                // проверка времени
                if (trigger.Time.Hours != now.Hour ||
                    trigger.Time.Minutes != now.Minute)
                    continue;

                // проверка дня недели
                if (!IsDayMatch(trigger.DaysOfWeek, now.DayOfWeek))
                    continue;

                // выполнение действия
                foreach (var action in trigger.Scenario.Actions)
                {
                    var device = await context.Devices
                        .FirstOrDefaultAsync(d => d.Id == action.DeviceId);

                    if (device == null) continue;

                    device.StateJson = action.Value;

                    var log = new ScenarioLog
                    {
                        ScenarioId = trigger.ScenarioId,
                        ExecutedAt = DateTime.UtcNow,
                        TriggerType = "TIME",
                        Details = $"Triggered at {now}"
                    };

                    context.ScenarioLogs.Add(log);
                }

                // сохраняем время последнего запуска
                _lastRun[trigger.Id] = now;
            }

            await context.SaveChangesAsync();
        }

        private bool IsDayMatch(string days, DayOfWeek currentDay)
        {
            if (days == "ALL")
                return true;

            var map = new Dictionary<DayOfWeek, string>
            {
                { DayOfWeek.Monday, "MON" },
                { DayOfWeek.Tuesday, "TUE" },
                { DayOfWeek.Wednesday, "WED" },
                { DayOfWeek.Thursday, "THU" },
                { DayOfWeek.Friday, "FRI" },
                { DayOfWeek.Saturday, "SAT" },
                { DayOfWeek.Sunday, "SUN" }
            };

            var today = map[currentDay];

            return days.Split(',').Contains(today);
        }
    }
}