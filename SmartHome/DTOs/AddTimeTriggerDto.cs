namespace SmartHome.DTOs
{
    public class AddTimeTriggerDto
    {
        public TimeSpan Time { get; set; }
        public string DaysOfWeek { get; set; } = "ALL";
    }
}