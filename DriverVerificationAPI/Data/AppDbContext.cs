using Microsoft.EntityFrameworkCore;
using DriverVerificationAPI.Models;

namespace DriverVerificationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options): base(options) { }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Admin> Admins { get; set; }
    }
}
