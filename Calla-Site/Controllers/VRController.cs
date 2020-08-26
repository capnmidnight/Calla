using Juniper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Linq;
using Yarrow.Data;

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

        [HttpGet]
        public IActionResult Index()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Activities
                .Include(act => act.ActivityStartPoints)
                    .ThenInclude(asp => asp.Station));
        }


        [HttpGet("VR/File/{id}")]
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
    }
}
