using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartHome.Migrations
{
    /// <inheritdoc />
    public partial class AddTelegramNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificationText",
                table: "Scenarios",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SendTelegramNotification",
                table: "Scenarios",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationText",
                table: "Scenarios");

            migrationBuilder.DropColumn(
                name: "SendTelegramNotification",
                table: "Scenarios");
        }
    }
}
