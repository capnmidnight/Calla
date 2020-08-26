using Juniper;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Linq;

using Yarrow.Data;

namespace Calla.Controllers
{
    public partial class YarrowVRController : Controller
    {
        private readonly YarrowContext db;
        private readonly IWebHostEnvironment env;

        public YarrowVRController(IWebHostEnvironment env, YarrowContext db)
        {
            this.env = env;
            this.db = db;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Activities()
        {
            return View(db.Activities);
        }

        [HttpGet("YarrowVR/Activity/{id}")]
        public IActionResult Activity(int id)
        {
            return View(db.Activities.SingleOrDefault(act => act.Id == id));
        }

        [HttpGet]
        public IActionResult ActivityStartPoints()
        {
            return View(db.ActivityStartPoints);
        }

        [HttpGet]
        public IActionResult AudioTracks()
        {
            return View(db.AudioTracks);
        }

        [HttpGet]
        public IActionResult Files()
        {
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
            return View(db.PlaybackControls);
        }

        [HttpGet]
        public IActionResult Signs()
        {
            return View(db.Signs);
        }

        [HttpGet]
        public IActionResult StationConnections()
        {
            return View(db.StationConnections);
        }

        [HttpGet]
        public IActionResult Stations()
        {
            return View(db.Stations);
        }

        [HttpGet]
        public IActionResult TransformInZone()
        {
            return View(db.TransformInZone);
        }

        [HttpGet]
        public IActionResult TransformParents()
        {
            return View(db.TransformParents);
        }

        [HttpGet]
        public IActionResult Transforms()
        {
            return View(db.Transforms);
        }

        [HttpGet]
        public IActionResult Zones()
        {
            return View(db.Zones);
        }
    }
}
