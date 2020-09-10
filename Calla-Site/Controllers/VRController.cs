using Juniper;
using Juniper.HTTP.Server;
using Juniper.World.GIS;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

using System;
using System.Linq;
using System.Text.Json;

using Yarrow.Data;
using Yarrow.Models;

namespace Calla.Controllers
{
    public class VRController : Controller
    {
        private readonly YarrowContext db;
        private readonly JsonSerializerOptions serializerOptions;

        public VRController(YarrowContext db, IHostEnvironment env)
        {
            this.db = db;
            serializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = env.IsDevelopment()
            };
        }

        [HttpGet("VR/File/{id}")]
        public IActionResult File(int id)
        {
            var acceptTypes = MediaType.ParseAll(Request.Headers["Accept"]);
            var fileInfo = db.Files
                .SingleOrDefault(f => f.Id == id);
            if (fileInfo is null)
            {
                return NotFound();
            }

            var type = MediaType.Parse(fileInfo.Mime);
            var fileName = type.AddExtension(fileInfo.Name);
            return new DbFileResult(db, fileInfo.Size, fileInfo.Mime, fileName, (cmd) =>
            {
                cmd.CommandType = System.Data.CommandType.Text;
                cmd.CommandText = "select \"Data\" from \"FileContents\" where \"FileID\" = @FileID";
                var pFileID = cmd.CreateParameter();
                pFileID.ParameterName = "FileID";
                pFileID.Value = id;
                cmd.Parameters.Add(pFileID);
            });
        }

        private static readonly Lesson DemoLesson = new Lesson
        {
            ID = 1,
            Name = "Demo"
        };

        private static readonly Language DemoChinese = new Language
        {
            ID = 1,
            Name = "Chinese",
            Enabled = true,
            Lessons = new Lesson[]
            {
                DemoLesson
            }
        };

        private static readonly Language DemoRussian = new Language
        {
            ID = 2,
            Name = "Russian",
            Enabled = false,
            Lessons = Array.Empty<Lesson>()
        };

        private static readonly Language[] DemoLanguages = new Language[] { DemoChinese, DemoRussian };

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("VR/Languages")]
        public IActionResult Languages()
        {
            return Json(DemoLanguages);
        }

        [HttpGet("VR/Language/{id}/Lessons")]
        public IActionResult Language(int id)
        {
            if (id != 1)
            {
                return NotFound();
            }

            return Json(DemoChinese.Lessons);
        }

        [HttpGet("VR/Lesson/{id}/Activities")]
        public IActionResult Activities(int id)
        {
            if (id != 1)
            {
                return NotFound();
            }

            return Json(db.Activities
               .AsNoTracking()
               .Select(act => new Activity
               {
                   ID = act.Id,
                   Name = act.Name
               }));
        }

        [HttpGet("VR/Activity/{id}")]
        public IActionResult Activity(int id)
        {
            var activity = db.Activities
                .AsNoTracking()
                .Where(act => act.Id == id)
                .Include(act => act.Transforms)
                    .ThenInclude(t => t.Stations)
                        .ThenInclude(s => s.StationConnectionsFromStation)
                .Include(act => act.Transforms)
                    .ThenInclude(t => t.AudioTracks)
                        .ThenInclude(aud => aud.PlaybackControls)
                .Include(act => act.Transforms)
                    .ThenInclude(t => t.Signs)
                .AsEnumerable()
                .Select(act => new FullActivity
                {
                    ID = act.Id,
                    Name = act.Name,
                    Transforms = act.Transforms
                        .Select(t => new Transform
                        {
                            ID = t.Id,
                            ParentID = t.ParentTransformId ?? 0,
                            Name = t.Name,
                            Matrix = t.Matrix
                        }),
                    Stations = act.Transforms
                        .Where(t => t.Stations is object)
                        .Select(t => new Station
                        {
                            TransformID = t.Stations.TransformId,
                            FileID = t.Stations.FileId,
                            Path = $"VR/File/{t.Stations.FileId}",
                            Location = new LatLngPoint(t.Stations.Latitude, t.Stations.Longitude, t.Stations.Altitude),
                            Rotation = t.Stations.Rotation,
                            IsStart = t.Stations.TransformId == act.StartStationId,
                            Zone = t.Stations.Zone
                        }),
                    Connections = act.Transforms
                        .Where(t => t.Stations is object && t.Stations.StationConnectionsFromStation is object)
                        .SelectMany(t => t.Stations.StationConnectionsFromStation
                            .Select(stc => new GraphEdge
                            {
                                FromStationID = stc.FromStationId,
                                ToStationID = stc.ToStationId
                            })),
                    AudioTracks = act.Transforms
                        .Where(t => t.AudioTracks is object)
                        .SelectMany(t => t.AudioTracks
                            .Select(at => new AudioTrack
                            {
                                TransformID = at.TransformId,
                                FileID = at.FileId,
                                Path = $"VR/File/{at.FileId}",
                                AutoPlay = at.AutoPlay,
                                Loop = at.Loop,
                                MaxDistance = at.MaxDistance,
                                MinDistance = at.MinDistance,
                                PlaybackTransformID = at.PlaybackControls?.TransformId ?? 0,
                                Spatialize = at.Spatialize,
                                Volume = at.Volume,
                                Zone = at.Zone
                            })),
                    Signs = act.Transforms
                        .Where(t => t.Signs is object)
                        .SelectMany(t => t.Signs
                            .Select(s => new Sign
                            {
                                TransformID = s.TransformId,
                                FileID = s.FileId,
                                Path = $"VR/File/{s.FileId}",
                                IsCallout = s.IsCallout
                            }))
                })
                .SingleOrDefault();

            var json = JsonSerializer.Serialize(activity, serializerOptions);
            return new JsonBlobResult(json);
        }
    }
}
