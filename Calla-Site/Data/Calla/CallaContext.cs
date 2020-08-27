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
            modelBuilder.Entity<Contacts>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Room).IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<Errors>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ErrorObject)
                    .IsRequired()
                    .HasColumnType("json");

                entity.Property(e => e.From).IsRequired();

                entity.Property(e => e.Message).IsRequired();

                entity.Property(e => e.On).IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<PageViews>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.From).IsRequired();

                entity.Property(e => e.Referrer).IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.To).IsRequired();

                entity.Property(e => e.UserAgent).IsRequired();
            });

            modelBuilder.Entity<Rooms>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.ShortName).IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
