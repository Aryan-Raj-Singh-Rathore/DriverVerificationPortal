using System.ComponentModel.DataAnnotations;

namespace DriverVerificationAPI.Models
{
    public class Driver
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string LicenseNumber { get; set; } = string.Empty;

        [Required]
        public string ContactNumber { get; set; } = string.Empty;

        public string Status { get; set; } = "Pending";

        public string? FaceImageUrl { get; set; }
        public string Email { get; set; } = string.Empty;

    }
}
