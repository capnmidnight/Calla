using Juniper;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Linq;

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

        [HttpGet("YarrowVR/Activity/{id}")]
        public IActionResult Activity(int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Activities
                .Include(at => at.ActivityStartPoints)
                    .ThenInclude(asp => asp.Station)
                        .ThenInclude(st => st.Transform)
                .SingleOrDefault(act => act.Id == id));
        }

        [HttpGet]
        public IActionResult ActivityStartPoints()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.ActivityStartPoints
                .Include(asp => asp.Activity)
                .Include(asp => asp.Station)
                    .ThenInclude(st => st.Transform));
        }

        [HttpGet]
        public IActionResult AudioTracks()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.AudioTracks);
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

        [HttpGet("YarrowVR/File/{id}")]
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
        public IActionResult TransformInZone()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.TransformInZone);
        }

        [HttpGet]
        public IActionResult TransformParents()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.TransformParents);
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

        [HttpGet]
        public IActionResult Zones()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Zones);
        }
    }
}
