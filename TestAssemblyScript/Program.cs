using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TestAssemblyScript
{
    public class Program
    {
        public static void Main(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => webBuilder
                    .ConfigureKestrel(kestrel => kestrel.AddServerHeader = false)
#if DEBUG
                    .UseUrls("http://*:80", "https://*:443")
#endif
                    .UseStartup<Startup>())
#if DEBUG
                 .ConfigureLogging(logging =>
                     logging.AddFilter("Microsoft.AspNetCore.Http.Connections", LogLevel.Debug))
#endif
                .Build()
                .Run();
    }
}
