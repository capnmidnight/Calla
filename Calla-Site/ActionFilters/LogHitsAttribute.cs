using Calla.Data;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
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
        private readonly byte[] salt;

        public LogHitsAttribute(ILogger<LogHitsAttribute> logger, IWebHostEnvironment env, CallaContext db, IConfiguration config)
        {
            this.logger = logger;
            this.env = env;
            this.db = db;
            var saltStr = config.GetValue<string>("IPSalt");
            if (saltStr is object)
            {
                salt = Convert.FromBase64String(saltStr);
            }
        }

        public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            if (context is object && env.IsProduction())
            {
                try
                {
                    foreach (var pv2 in db.PageViews)
                    {
                        if (pv2.From.StartsWith("::ffff", StringComparison.InvariantCultureIgnoreCase))
                        {
                            pv2.From = PageViews.SaltAddr(pv2.From, salt);
                        }
                    }

                    await db.PageViews
                        .AddAsync(new PageViews(context.HttpContext, salt))
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
