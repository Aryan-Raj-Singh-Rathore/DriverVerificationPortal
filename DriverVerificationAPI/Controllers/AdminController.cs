using Microsoft.AspNetCore.Mvc;
using DriverVerificationAPI.Data;
using DriverVerificationAPI.Models;
using DriverVerificationAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace DriverVerificationAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginData)
        {
            var admin = _context.Admins.FirstOrDefault(a => a.Username == loginData.Username);

            if (admin == null || !BCrypt.Net.BCrypt.Verify(loginData.Password, admin.PasswordHash))
                return Unauthorized("Invalid username or password");

            // Simulated token for now
            string token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            return Ok(new { token });
        }

        [HttpGet("drivers")] // ✅ Corrected route here
        public async Task<IActionResult> GetAllDrivers()
        {
            var drivers = await _context.Drivers
                .Select(d => new
                {
                    d.Id,
                    d.Name,
                    d.Email,
                    d.ContactNumber,
                    d.LicenseNumber,
                    d.Status,
                    imageUrl = $"{Request.Scheme}://{Request.Host}{d.FaceImageUrl}"
                })
                .ToListAsync();

            return Ok(drivers);
        }



        [HttpPut("verify/{id}")]
        public async Task<IActionResult> VerifyDriver(int id)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);
                if (driver == null)
                    return NotFound("Driver not found");

                driver.Status = "Verified";
                await _context.SaveChangesAsync();
                return Ok(driver);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error verifying driver: {ex.Message}");
            }
        }

        [HttpPut("reject/{id}")]
        public async Task<IActionResult> RejectDriver(int id)
        {
            try
            {
                var driver = await _context.Drivers.FindAsync(id);
                if (driver == null)
                    return NotFound("Driver not found");

                driver.Status = "Rejected";
                await _context.SaveChangesAsync();
                return Ok(driver);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error rejecting driver: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            try
            {
                // Delete image file from wwwroot if exists
                if (!string.IsNullOrEmpty(driver.FaceImageUrl))
                {
                    var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    var sanitizedImagePath = driver.FaceImageUrl.TrimStart('/', '\\');
                    var imagePath = Path.Combine(wwwRootPath, sanitizedImagePath);

                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                _context.Drivers.Remove(driver);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Driver and associated image deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error while deleting driver", error = ex.Message });
            }
        }


    }
}
