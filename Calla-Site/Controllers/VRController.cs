using Juniper;
using Juniper.Mathematics;
using Juniper.World.GIS;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Linq;
using System.Threading.Tasks;

using Yarrow.Data;
using Yarrow.Models;

namespace Calla.Controllers
{
    public class VRController : Controller
    {
        private readonly YarrowContext db;
        private readonly IWebHostEnvironment env;

        public VRController(IWebHostEnvironment env, YarrowContext db)
        {
            this.env = env;
            this.db = db;
        }

        [HttpGet("VR/File/{id}")]
        public async Task<IActionResult> File(int id)
        {
            var file = await db.Files
                .Include(f => f.FileContents)
                .SingleOrDefaultAsync(f => f.Id == id)
                .ConfigureAwait(false);
            if (file is null
                || !MediaType.TryParse(file.Mime, out var type))
            {
                return NotFound();
            }
            else
            {
                var fileName = type.AddExtension(file.Name);
                return File(file.FileContents.Data, file.Mime, fileName);
            }
        }

        [HttpGet]
        public IActionResult Index()
        {
            var activities = db.Activities
                .Include(act => act.StartStation)
                .Select(act => new Activity
                {
                    ID = act.Id,
                    Name = act.Name,
                    StartStationFileID = act.StartStation.FileId
                });
            return View(activities);
        }

        [HttpGet("VR/Activity/{id}/Transforms")]
        public IActionResult Activity(int id)
        {
            var transforms = db.Transforms
                .Where(t => t.ActivityId == id)
                .Select(t => new Transform
                {
                    ID = t.Id,
                    ParentID = t.ParentTransformId ?? 0,
                    Name = t.Name,
                    Matrix = new Matrix4x4Serializable(t.Matrix)
                });
            return base.Json(transforms);
        }

        [HttpGet("VR/Activity/{id}/Stations")]
        public IActionResult ActivityStations(int id)
        {
            var stations = db.Stations
                .Include(st => st.Transform)
                .Include(st => st.StationConnectionsFromStation)
                .Where(st => st.Transform.ActivityId == id)
                .Select(st => new Station
                {
                    ID = st.TransformId,
                    Location = new LatLngPoint(st.Latitude, st.Longitude, st.Altitude),
                    Rotation = new QuaternionSerializable(st.Rotation),
                    FileID = st.FileId,
                    Zone = st.Zone
                });
            return Json(stations);
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
