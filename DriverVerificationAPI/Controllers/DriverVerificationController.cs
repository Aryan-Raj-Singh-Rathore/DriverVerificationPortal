using Microsoft.AspNetCore.Mvc;
using DriverVerificationAPI.Data;
using DriverVerificationAPI.DTOs;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace DriverVerificationAPI.Controllers
{
    [ApiController]
    [Route("api")]
    public class FaceVerificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IFaceClient _faceClient;

        public FaceVerificationController(AppDbContext context, IConfiguration config, IFaceClient faceClient)
        {
            _context = context;
            _config = config;
            _faceClient = faceClient;
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyFace([FromBody] FaceVerificationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ImageBase64))
                return BadRequest(new { matchFound = false, message = "No image provided" });

            if (string.IsNullOrWhiteSpace(dto.LicenseNumber))
                return BadRequest(new { matchFound = false, message = "License number is required" });

            try
            {
                // Parse the base64 image
                string base64Data = dto.ImageBase64.Contains(",")
                    ? dto.ImageBase64.Split(',')[1]
                    : dto.ImageBase64;

                byte[] imageBytes = Convert.FromBase64String(base64Data);
                using var uploadedStream = new MemoryStream(imageBytes);

                // Initialize Azure Face Client
                var faceClient = new FaceClient(new ApiKeyServiceClientCredentials(_config["AzureFace:Key"]))
                {
                    Endpoint = _config["AzureFace:Endpoint"]
                };

                // Detect face in the uploaded image
                var uploadedFaces = await faceClient.Face.DetectWithStreamAsync(
                    uploadedStream,
                    returnFaceId: true,
                    detectionModel: DetectionModel.Detection01
                );

                if (uploadedFaces.Count == 0)
                    return BadRequest(new { matchFound = false, message = "No face detected in captured image. Try again." });

                var uploadedFaceId = uploadedFaces.First().FaceId;

                // Get the stored driver
                var storedDriver = await _context.Drivers.FirstOrDefaultAsync(d => d.LicenseNumber == dto.LicenseNumber);
                if (storedDriver == null)
                    return NotFound(new { matchFound = false, message = "Driver not found." });

                // Validate and load stored face image
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", storedDriver.FaceImageUrl.TrimStart('/'));

                if (!System.IO.File.Exists(imagePath))
                    return NotFound(new { matchFound = false, message = "Stored image not found at path: " + imagePath });

                using var storedStream = System.IO.File.OpenRead(imagePath);
                var storedFaces = await faceClient.Face.DetectWithStreamAsync(
                    storedStream,
                    returnFaceId: true,
                    detectionModel: DetectionModel.Detection01
                );

                if (storedFaces.Count == 0)
                    return BadRequest(new { matchFound = false, message = "No face detected in stored driver's image." });

                var storedFaceId = storedFaces.First().FaceId;

                // Compare the faces
                var verifyResult = await faceClient.Face.VerifyFaceToFaceAsync(uploadedFaceId.Value, storedFaceId.Value);

                if (verifyResult.IsIdentical && verifyResult.Confidence > 0.6)
                {
                    return Ok(new
                    {
                        matchFound = true,
                        licenseNumber = storedDriver.LicenseNumber,
                        confidence = verifyResult.Confidence,
                        message = "Face match successful"
                    });
                }

                return Ok(new
                {
                    matchFound = false,
                    confidence = verifyResult.Confidence,
                    message = "Face does not match the driver's record."
                });
            }
            catch (FormatException)
            {
                return BadRequest(new { matchFound = false, message = "Invalid image format. Please capture the image again." });
            }
            catch (APIErrorException ex)
            {
                return StatusCode(500, new { matchFound = false, message = "Azure Face API error: " + ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { matchFound = false, message = "Internal error: " + ex.Message });
            }
        }
    }
}
