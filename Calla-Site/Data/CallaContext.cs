using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Calla.Data
{
    public partial class CallaContext : DbContext
    {
        public CallaContext()
        {
        }

        public CallaContext(DbContextOptions<CallaContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Contacts> Contacts { get; set; }
        public virtual DbSet<Errors> Errors { get; set; }
        public virtual DbSet<PageViews> PageViews { get; set; }
        public virtual DbSet<Rooms> Rooms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Name=ConnectionStrings:Calla");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("postgis");

            modelBuilder.Entity<Contacts>(entity =>
            {
                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<Errors>(entity =>
            {
                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<PageViews>(entity =>
            {
                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<Rooms>(entity =>
            {
                entity.Property(e => e.Timestamp).HasDefaultValueSql("now()");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
