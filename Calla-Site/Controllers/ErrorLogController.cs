using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Calla.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Calla.Controllers
{
    public class ErrorLogController : Controller
    {
        private readonly ILogger<ErrorLogController> logger;
        private readonly IWebHostEnvironment env;

        public ErrorLogController(ILogger<ErrorLogController> logger, IWebHostEnvironment env)
        {
            this.logger = logger;
            this.env = env;
        }

        [HttpPost(Name = "ErrorLog")]
        public ActionResult Index([FromBody] TraceKitErrorModel err)
        {
            if (err != null)
            {
                logger.LogError(err.message, err);
            }

            return Ok();
        }
    }
}
