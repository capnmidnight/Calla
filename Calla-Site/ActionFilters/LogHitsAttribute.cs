using Calla.Data;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using System;
using System.Threading.Tasks;

namespace Calla.ActionFilters
{
    public class LogHitsAttribute : ActionFilterAttribute
    {
        private readonly ILogger<LogHitsAttribute> logger;
        private readonly IWebHostEnvironment env;
        private readonly CallaContext db;
        
        public LogHitsAttribute(ILogger<LogHitsAttribute> logger, IWebHostEnvironment env, CallaContext db)
        {
            this.logger = logger;
            this.env = env;
            this.db = db;
        }

        public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            if (context is object && env.IsProduction())
            {
                try
                {
                    await db.PageViews
                        .AddAsync(new PageViews(context.HttpContext))
                        .ConfigureAwait(false);

                    await db.SaveChangesAsync()
                        .ConfigureAwait(false);
                }
                catch (Exception exp)
                {
                    logger.LogError(exp, "Error while logging page view");
                }
            }

            await base.OnResultExecutionAsync(context, next)
                .ConfigureAwait(false);
        }
    }
}
