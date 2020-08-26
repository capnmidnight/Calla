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
