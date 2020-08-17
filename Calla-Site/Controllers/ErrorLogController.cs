using Calla.Data;
using Calla.Models;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using System.Linq;
using System.Threading.Tasks;

namespace Calla.Controllers
{
    public class ErrorLogController : Controller
    {
        private readonly ILogger<ErrorLogController> logger;
        private readonly IWebHostEnvironment env;
        private readonly CallaContext db;

        public ErrorLogController(ILogger<ErrorLogController> logger, IWebHostEnvironment env, CallaContext db)
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

            var errors = db.Errors
                .OrderBy(err => err.Id)
                .ToArray();

            return View(errors);
        }

        [HttpPost]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Index([FromBody] TraceKitErrorModel err)
        {
            if (err != null)
            {
                logger.LogError(err.message, err);
                _ = await db.Errors.AddAsync(new Errors
                {
                    From = Request.HttpContext.Connection.RemoteIpAddress.ToString(),
                    On = Request.Headers["Referer"].FirstOrDefault() ?? "N/A",
                    Message = err.message,
                    ErrorObject = JsonConvert.SerializeObject(err)
                }).ConfigureAwait(false);
                await db.SaveChangesAsync().ConfigureAwait(false);
            }

            return Ok();
        }

        [HttpDelete]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Index([FromBody] int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var errs = db.Errors.Where(err => err.Id == id);
            db.Errors.RemoveRange(errs);
            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }
    }
}
