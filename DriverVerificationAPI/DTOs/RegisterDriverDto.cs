// DTOs/RegisterDriverDto.cs
public class RegisterDriverDto
{
    public string Name { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string ImageBase64 { get; set; } = string.Empty; // File upload for face image
}
