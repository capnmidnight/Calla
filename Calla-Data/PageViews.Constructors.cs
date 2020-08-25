using Microsoft.AspNetCore.Cryptography.KeyDerivation;
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

        public PageViews(HttpContext context, byte[] salt)
        {
            if (context is null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var addr = context.Connection.RemoteIpAddress.ToString();
            From = SaltAddr(addr, salt);
            To = context.Request.Path.Value;
            Referrer = context.Request.Headers["Referer"].FirstOrDefault() ?? "N/A";
            UserAgent = context.Request.Headers["User-Agent"].FirstOrDefault() ?? "N/A";
        }

        public static string SaltAddr(string addr, byte[] salt)
        {
            if (salt?.Length > 0)
            {
                addr = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                    password: addr,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA1,
                    iterationCount: 10000,
                    numBytesRequested: 32));
            }

            return addr;
        }
    }
}
