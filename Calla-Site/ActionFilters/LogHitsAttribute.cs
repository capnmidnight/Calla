using Calla.Data;

using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

using System;
using System.Linq;
using System.Threading.Tasks;

namespace Calla.ActionFilters
{
    public class LogHitsAttribute : ActionFilterAttribute
    {
        private readonly ILogger<LogHitsAttribute> logger;
        private readonly CallaContext db;
        public LogHitsAttribute(ILogger<LogHitsAttribute> logger, CallaContext db)
        {
            this.logger = logger;
            this.db = db;
        }

        public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            try
            {
                await db.PageViews.AddAsync(new PageViews
                {
                    From = context.HttpContext.Connection.RemoteIpAddress.ToString(),
                    To = context.HttpContext.Request.Path.Value,
                    Referrer = context.HttpContext.Request.Headers["Referer"].FirstOrDefault() ?? "N/A"
                }).ConfigureAwait(false);

                await db.SaveChangesAsync()
                    .ConfigureAwait(false);
            }
            catch (Exception exp)
            {
                logger.LogError(exp, "Error while logging page view");
            }

            await base.OnResultExecutionAsync(context, next)
                .ConfigureAwait(false);
        }
    }
}
