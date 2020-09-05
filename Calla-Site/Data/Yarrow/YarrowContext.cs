using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Yarrow.Data
{
    public partial class YarrowContext : DbContext
    {
        public YarrowContext()
        {
        }

        public YarrowContext(DbContextOptions<YarrowContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Activities> Activities { get; set; }
        public virtual DbSet<AudioTracks> AudioTracks { get; set; }
        public virtual DbSet<FileContents> FileContents { get; set; }
        public virtual DbSet<Files> Files { get; set; }
        public virtual DbSet<PlaybackControls> PlaybackControls { get; set; }
        public virtual DbSet<Signs> Signs { get; set; }
        public virtual DbSet<StationConnections> StationConnections { get; set; }
        public virtual DbSet<Stations> Stations { get; set; }
        public virtual DbSet<Transforms> Transforms { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Name=ConnectionStrings:Yarrow");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Activities>(entity =>
            {
                entity.HasIndex(e => e.StartStationId)
                    .HasName("fki_FK_Activity_StartStation");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.StartStationId).HasColumnName("StartStationID");

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");

                entity.HasOne(d => d.StartStation)
                    .WithMany(p => p.Activities)
                    .HasForeignKey(d => d.StartStationId)
                    .HasConstraintName("FK_Activity_StartStation");
            });

            modelBuilder.Entity<AudioTracks>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.AudioTracks)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AudioTracks_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.AudioTracks)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AudioTracks_Transforms");
            });

            modelBuilder.Entity<FileContents>(entity =>
            {
                entity.HasKey(e => e.FileId)
                    .HasName("FileContents_pkey");

                entity.Property(e => e.FileId)
                    .HasColumnName("FileID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Data).IsRequired();

                entity.HasOne(d => d.File)
                    .WithOne(p => p.FileContents)
                    .HasForeignKey<FileContents>(d => d.FileId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FileContents_Files");
            });

            modelBuilder.Entity<Files>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Mime)
                    .IsRequired()
                    .HasColumnName("MIME");

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.Timestamp)
                    .HasColumnType("timestamp with time zone")
                    .HasDefaultValueSql("now()");
            });

            modelBuilder.Entity<PlaybackControls>(entity =>
            {
                entity.HasKey(e => e.AudioTrackId)
                    .HasName("PlaybackControls_pkey");

                entity.Property(e => e.AudioTrackId)
                    .HasColumnName("AudioTrackID")
                    .ValueGeneratedNever();

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.AudioTrack)
                    .WithOne(p => p.PlaybackControls)
                    .HasForeignKey<PlaybackControls>(d => d.AudioTrackId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlaybackControls_AudioTracks");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.PlaybackControls)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PlaybackControls_Transforms");
            });

            modelBuilder.Entity<Signs>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.TransformId).HasColumnName("TransformID");

                entity.HasOne(d => d.File)
                    .WithMany(p => p.Signs)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Signs_Files");

                entity.HasOne(d => d.Transform)
                    .WithMany(p => p.Signs)
                    .HasForeignKey(d => d.TransformId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Signs_Transforms");
            });

            modelBuilder.Entity<StationConnections>(entity =>
            {
                entity.HasKey(e => new { e.FromStationId, e.ToStationId })
                    .HasName("StationConnections_pkey");

                entity.Property(e => e.FromStationId).HasColumnName("FromStationID");

                entity.Property(e => e.ToStationId).HasColumnName("ToStationID");

                entity.HasOne(d => d.FromStation)
                    .WithMany(p => p.StationConnectionsFromStation)
                    .HasForeignKey(d => d.FromStationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StationConnection_From");

                entity.HasOne(d => d.ToStation)
                    .WithMany(p => p.StationConnectionsToStation)
                    .HasForeignKey(d => d.ToStationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StationConnection_To");
            });

            modelBuilder.Entity<Stations>(entity =>
            {
                entity.HasKey(e => e.TransformId)
                    .HasName("Stations_pkey");

                entity.Property(e => e.TransformId)
                    .HasColumnName("TransformID")
                    .ValueGeneratedNever();

                entity.Property(e => e.FileId).HasColumnName("FileID");

                entity.Property(e => e.Rotation).IsRequired();

                entity.HasOne(d => d.File)
                    .WithMany(p => p.Stations)
                    .HasForeignKey(d => d.FileId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Stations_Files");

                entity.HasOne(d => d.Transform)
                    .WithOne(p => p.Stations)
                    .HasForeignKey<Stations>(d => d.TransformId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Stations_Transforms");
            });

            modelBuilder.Entity<Transforms>(entity =>
            {
                entity.HasIndex(e => e.ActivityId)
                    .HasName("fki_FK_Transforms_Activities");

                entity.HasIndex(e => e.ParentTransformId)
                    .HasName("fki_FK_Transforms_ParentTransforms");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.ActivityId).HasColumnName("ActivityID");

                entity.Property(e => e.FullPath).IsRequired();

                entity.Property(e => e.Matrix).IsRequired();

                entity.Property(e => e.Name).IsRequired();

                entity.Property(e => e.ParentTransformId).HasColumnName("ParentTransformID");

                entity.Property(e => e.MatrixKind).IsRequired();

                entity.HasOne(d => d.Activity)
                    .WithMany(p => p.Transforms)
                    .HasForeignKey(d => d.ActivityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Transforms_Activities");

                entity.HasOne(d => d.ParentTransform)
                    .WithMany(p => p.InverseParentTransform)
                    .HasForeignKey(d => d.ParentTransformId)
                    .HasConstraintName("FK_Transforms_ParentTransforms");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
