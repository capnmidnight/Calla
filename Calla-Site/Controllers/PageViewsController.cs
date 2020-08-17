using Calla.Data;
using Calla.Models;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using System.Linq;
using System.Threading.Tasks;

namespace Calla.Controllers
{
    public class PageViewsController : Controller
    {
        private readonly ILogger<PageViewsController> logger;
        private readonly IWebHostEnvironment env;
        private readonly CallaContext db;

        public PageViewsController(ILogger<PageViewsController> logger, IWebHostEnvironment env, CallaContext db)
        {
            this.logger = logger;
            this.env = env;
            this.db = db;
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Index()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var views = db.PageViews
                .OrderBy(v => v.From)
                .ThenBy(v => v.Timestamp)
                .ToArray();

            return View(views);
        }

        [HttpDelete]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Index([FromBody] int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var pvs = db.PageViews.Where(v => v.Id == id);
            db.PageViews.RemoveRange(pvs);
            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }
    }
}
