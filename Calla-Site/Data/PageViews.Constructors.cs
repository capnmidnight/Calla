using Microsoft.AspNetCore.Http;

using System;
using System.Linq;

namespace Calla.Data
{
    public partial class PageViews
    {
        public PageViews()
        {

        }

        public PageViews(HttpContext context)
        {
            if (context is null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            From = context.Connection.RemoteIpAddress.ToString();
            To = context.Request.Path.Value;
            Referrer = context.Request.Headers["Referer"].FirstOrDefault() ?? "N/A";
            UserAgent = context.Request.Headers["User-Agent"].FirstOrDefault() ?? "N/A";
        }
    }
}
