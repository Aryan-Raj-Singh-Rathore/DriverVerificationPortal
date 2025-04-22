using DriverVerificationAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Azure.CognitiveServices.Vision.Face;
using Microsoft.Azure.CognitiveServices.Vision.Face.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// ✅ Add Azure Face API Client
builder.Services.AddSingleton<IFaceClient>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var subscriptionKey = configuration["FaceApi:Key"];
    var endpoint = configuration["FaceApi:Endpoint"];

    return new FaceClient(new ApiKeyServiceClientCredentials(subscriptionKey))
    {
        Endpoint = endpoint
    };
});

var app = builder.Build();

// Middleware
app.UseStaticFiles();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();
app.Run();
