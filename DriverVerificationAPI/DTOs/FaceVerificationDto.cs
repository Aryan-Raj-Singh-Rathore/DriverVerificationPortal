namespace DriverVerificationAPI.DTOs
{
    public class FaceVerificationDto
    {
        public string ImageBase64 { get; set; } = string.Empty; // 👈 this is required
        public string LicenseNumber { get; set; } = string.Empty;
        public int DriverId { get; set; }
    }
}
