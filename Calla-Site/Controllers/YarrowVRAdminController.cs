using Juniper;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

using System.Linq;
using System.Threading.Tasks;

using Yarrow.Data;

namespace Calla.Controllers
{
    public partial class YarrowVRAdminController : Controller
    {
        private readonly YarrowContext db;
        private readonly IWebHostEnvironment env;

        public YarrowVRAdminController(IWebHostEnvironment env, YarrowContext db)
        {
            this.env = env;
            this.db = db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View();
        }

        [HttpGet]
        public IActionResult Activities()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Activities);
        }

        [HttpGet("YarrowVRAdmin/Activity/{id}")]
        public IActionResult Activity(int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Activities
                .SingleOrDefault(act => act.Id == id));
        }

        [HttpGet]
        public IActionResult AudioTracks()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.AudioTracks
                .AsNoTracking()
                .Include(at => at.File)
                .Include(at => at.Transform)
                    .ThenInclude(t => t.Activity)
                .Select(at => new Yarrow.Models.Admin.AudioTrack
                {
                    ID = at.Id,
                    ActivityName = at.Transform.Activity.Name,
                    AutoPlay = at.AutoPlay,
                    FileID = at.File.Id,
                    FileName = at.File.Name,
                    FileSize = Juniper.Units.FileSize.Format((ulong)at.File.Size, Juniper.Units.UnitOfMeasure.Bytes),
                    Loop = at.Loop,
                    MaxDistance = at.MaxDistance,
                    Mime = at.File.Mime,
                    MinDistance = at.MinDistance,
                    Path = $"VR/File/{at.File.Id}",
                    PlaybackTransformID = at.PlaybackControls.TransformId,
                    Spatialize = at.Spatialize,
                    TransformID = at.TransformId,
                    TransformPath = at.Transform.FullPath,
                    Volume = at.Volume,
                    Zone = at.Zone
                })
                .OrderBy(at => at.ActivityName)
                .ThenBy(at => at.Zone)
                .ThenBy(at => at.FileID));
        }

        [HttpPost]
        public async Task<IActionResult> AudioTracks([FromBody] Yarrow.Models.Admin.AudioTrack audioTrack)
        {
            if (!env.IsDevelopment()
                || audioTrack is null)
            {
                return NotFound();
            }

            if (audioTrack.ID > 0)
            {
                var cur = await db.AudioTracks
                    .SingleOrDefaultAsync(r => r.Id == audioTrack.ID)
                    .ConfigureAwait(false);

                cur.Spatialize = audioTrack.Spatialize;

                await db.SaveChangesAsync()
                    .ConfigureAwait(false);

                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public IActionResult Files()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Files);
        }

        [HttpGet("YarrowVRAdmin/File/{id}")]
        public IActionResult File(int id)
        {
            var file = db.Files
                .Include(f => f.FileContents)
                .SingleOrDefault(f => f.Id == id);
            if (file is null
                || !MediaType.TryParse(file.Mime, out var type))
            {
                return NotFound();
            }
            else
            {
                var fileName = type.AddExtension(file.Name);
                return base.File(file.FileContents.Data, file.Mime, fileName);
            }
        }

        [HttpGet]
        public IActionResult PlaybackControls()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.PlaybackControls);
        }

        [HttpGet]
        public IActionResult Signs()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Signs);
        }

        [HttpGet]
        public IActionResult StationConnections()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.StationConnections);
        }

        [HttpGet]
        public IActionResult Stations()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Stations);
        }

        [HttpGet]
        public IActionResult Transforms()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Transforms);
        }
    }
}
