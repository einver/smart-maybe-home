using Microsoft.EntityFrameworkCore;
using SmartHome.Models;

namespace SmartHome.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Device>()
                .Property(d => d.Type)
                .HasConversion<string>();
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Device> Devices { get; set; }
        public DbSet<DeviceEvent> DeviceEvents { get; set; }

        public DbSet<Scenario> Scenarios { get; set; }
        public DbSet<Condition> Conditions { get; set; }
        public DbSet<ActionEntity> Actions { get; set; }
        public DbSet<TimeTrigger> TimeTriggers { get; set; }
        public DbSet<ScenarioLog> ScenarioLogs { get; set; }
        public DbSet<DeviceLog> DeviceLogs => Set<DeviceLog>();
    }
}