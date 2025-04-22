using Microsoft.AspNetCore.Mvc;
using DriverVerificationAPI.Data;
using DriverVerificationAPI.Models;
using Microsoft.EntityFrameworkCore;
using DriverVerificationAPI.DTOs;



namespace DriverVerificationAPI.Controllers
{
    [ApiController]
    [Route("api/driver")]
    public class DriverController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DriverController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterDriver([FromBody] RegisterDriverDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ImageBase64))
                return BadRequest("Invalid driver data or missing image");

            try
            {
                // Split safely and decode base64
                var base64Data = dto.ImageBase64.Contains(",")
                    ? dto.ImageBase64.Split(',')[1]
                    : dto.ImageBase64;

                var imageBytes = Convert.FromBase64String(base64Data);

                // Save image to disk
                var fileName = $"{Guid.NewGuid()}.jpg";
                var uploadsFolder = Path.Combine("wwwroot", "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var filePath = Path.Combine(uploadsFolder, fileName);
                await System.IO.File.WriteAllBytesAsync(filePath, imageBytes);

                var driver = new Driver
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    ContactNumber = dto.ContactNumber,
                    LicenseNumber = dto.LicenseNumber,
                    FaceImageUrl = $"/uploads/{fileName}",
                    Status = "Pending"
                };

                _context.Drivers.Add(driver);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Driver registered successfully" });
            }
            catch (FormatException)
            {
                return BadRequest("Invalid image format. Please recapture the image.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error: " + ex.Message });
            }
        }



        [HttpGet("status/{licenseNumber}")]
        public async Task<IActionResult> GetDriverStatus(string licenseNumber)
        {
            var driver = await _context.Drivers
                .Where(d => d.LicenseNumber == licenseNumber)
                .Select(d => new
                {
                    d.Name,
                    d.Email,
                    d.ContactNumber,
                    d.LicenseNumber,
                    d.Status,
                    imageUrl = $"{Request.Scheme}://{Request.Host}{d.FaceImageUrl}"

                })
                .FirstOrDefaultAsync();

            if (driver == null)
                return NotFound("Driver not found");

            return Ok(driver);
        }

        [HttpGet("pending")]
        public IActionResult GetPendingDrivers()
        {
            var drivers = _context.Drivers.Where(d => d.Status == "Pending").ToList();
            return Ok(drivers);
        }

        [HttpPut("verify/{id}")]
        public async Task<IActionResult> VerifyDriver(int id, [FromQuery] string status)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return NotFound();

            driver.Status = status; // "Verified" or "Rejected"
            await _context.SaveChangesAsync();
            return Ok(driver);
        }
    }
}
