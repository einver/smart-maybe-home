using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartHome.Migrations
{
    /// <inheritdoc />
    public partial class AddConnectionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsVirtual",
                table: "Devices");

            migrationBuilder.AddColumn<int>(
                name: "ConnectionType",
                table: "Devices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ExternalId",
                table: "Devices",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectionType",
                table: "Devices");

            migrationBuilder.DropColumn(
                name: "ExternalId",
                table: "Devices");

            migrationBuilder.AddColumn<bool>(
                name: "IsVirtual",
                table: "Devices",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
