namespace SmartHome.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public long? TelegramChatId { get; set; }

        public List<Room> Rooms { get; set; } = new();
        public List<Scenario> Scenarios { get; set; } = new();
    }
}