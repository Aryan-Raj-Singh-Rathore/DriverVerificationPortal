using System.ComponentModel.DataAnnotations;

namespace DriverVerificationAPI.Models
{
    public class Admin
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
    }
}
