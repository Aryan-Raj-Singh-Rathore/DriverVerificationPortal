using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DriverVerificationAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddFaceImageUrlToDriver : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FaceImageUrl",
                table: "Drivers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FaceImageUrl",
                table: "Drivers");
        }
    }
}
