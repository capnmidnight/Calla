using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using Juniper.IO;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

using Yarrow.Data;
using Yarrow.V2.Data;

namespace Calla.Controllers
{
    public class YarrowVRController : Controller
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
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var activitiesRoot = new DirectoryInfo(".")
                .CD("wwwroot")
                .CD("data")
                .CD("activities");

            var activitySerializer = new JsonFactory<Activity>();

            var activities = from dir in activitiesRoot.GetDirectories()
                             let file = dir.Touch("Activity.json")
                             where file.Exists
                             select activitySerializer.Deserialize(file, null);

            var otherActivities = db.Activities.ToArray();

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
