using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace Calla
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSystemd()
                .ConfigureWebHostDefaults(webBuilder => webBuilder
                    .ConfigureKestrel(kestrel => kestrel.AddServerHeader = false)
                    .UseStartup<Startup>());
    }
}
