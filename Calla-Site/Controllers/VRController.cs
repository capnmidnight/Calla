using Juniper;
using Juniper.World.GIS;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

using System;
using System.Linq;

using Yarrow.Data;
using Yarrow.Models;

namespace Calla.Controllers
{
    public class VRController : Controller
    {
        private readonly YarrowContext db;

        public VRController(YarrowContext db)
        {
            this.db = db;
        }

        [HttpGet("VR/File/{id}")]
        public IActionResult File(int id)
        {
            var file = db.Files
                .Include(f => f.FileContents)
                .SingleOrDefault(f => f.Id == id);
            if (file is null)
            {
                return NotFound();
            }

            var type = MediaType.Parse(file.Mime);
            var fileName = type.AddExtension(file.Name);
            return File(file.FileContents.Data, file.Mime, fileName);
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

            var activities = db.Activities
               .Include(act => act.StartStation)
               .Select(act => new Activity
               {
                   ID = act.Id,
                   Name = act.Name,
                   StartStationFileID = act.StartStation.FileId
               });

            return Json(activities);
        }

        [HttpGet("VR/Activity/{id}/Scene")]
        public IActionResult Scene(int id)
        {
            var transforms = db.Transforms
                .Where(t => t.ActivityId == id)
                .Select(t => new Transform
                {
                    ID = t.Id,
                    ParentID = t.ParentTransformId ?? 0,
                    Name = t.Name,
                    Matrix = t.Matrix
                });
            return Json(transforms);
        }

        [HttpGet("VR/Activity/{id}/Stations")]
        public IActionResult ActivityStations(int id)
        {
            var stations = db.Stations
                .Include(st => st.Transform)
                    .ThenInclude(t => t.Activity)
                .Where(st => st.Transform.ActivityId == id)
                .Select(st => new Station
                {
                    TransformID = st.TransformId,
                    Location = new LatLngPoint(st.Latitude, st.Longitude, st.Altitude),
                    Rotation = st.Rotation,
                    FileID = st.FileId,
                    IsStart = st.TransformId == st.Transform.Activity.StartStationId,
                    Zone = st.Zone
                });
            return Json(stations);
        }

        [HttpGet("VR/Activity/{id}/Map")]
        public IActionResult ActivityStationConnections(int id)
        {
            var edges = db.StationConnections
                .Include(stc => stc.FromStation)
                    .ThenInclude(st => st.Transform)
                .Where(stc => stc.FromStation.Transform.ActivityId == id)
                .Select(stc => new GraphEdge
                {
                    FromStationID = stc.FromStationId,
                    ToStationID = stc.ToStationId
                });
            return Json(edges);
        }

        [HttpGet("VR/Activity/{id}/Audio")]
        public IActionResult ActivityAudio(int id)
        {
            var audio = db.AudioTracks
                .Include(at => at.Transform)
                .Include(at => at.PlaybackControls)
                .Where(at => at.Transform.ActivityId == id)
                .Select(at => new AudioTrack
                {
                    AudioFileID = at.FileId,
                    AutoPlay = at.AutoPlay,
                    Loop = at.Loop,
                    MaxDistance = at.MaxDistance,
                    MinDistance = at.MinDistance,
                    PlaybackTransformID = at.PlaybackControls.TransformId,
                    Spatialize = at.Spatialize,
                    TransformID = at.TransformId,
                    Volume = at.Volume,
                    Zone = at.Zone
                });
            return Json(audio);
        }

        [HttpGet("VR/Activity/{id}/Signs")]
        public IActionResult ActivitySigns(int id)
        {
            var signs = db.Signs
                .Include(s => s.Transform)
                .Where(s => s.Transform.ActivityId == id)
                .Select(s => new Sign
                {
                    ImageFileID = s.FileId,
                    IsCallout = s.IsCallout,
                    TransformID = s.TransformId
                });
            return Json(signs);
        }
    }
}
