using Juniper;
using Juniper.IO;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

using System.IO;

using Yarrow.Data;
using Yarrow.V2.Data;

namespace Calla.Controllers
{
    public class YarrowVRController : Controller
    {
        private static readonly DirectoryInfo activitiesRoot = new DirectoryInfo(".")
                .CD("wwwroot")
                .CD("data")
                .CD("activities");

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
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var activities = from dir in activitiesRoot.GetDirectories()
                             let file = dir.Touch("Activity.json")
                             where file.Exists
                             select file.Directory.Name;

            return View(activities.ToArray());
        }

        [HttpPost("{activityName}")]
        public IActionResult Index(string activityName)
        {
            if (!env.IsDevelopment()
                || string.IsNullOrWhiteSpace(activityName))
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
