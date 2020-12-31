using Calla.ActionFilters;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using System;

using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

using Calla.Hubs;

namespace Calla
{
    public class Startup
    {
        private IWebHostEnvironment Environment { get; }
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Environment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            if (Environment.IsProduction())
            {
                services.AddLettuceEncrypt();
            }

            services.AddLogging(LoggerOpts);
            services.AddRazorPages();
            services.AddAuthentication();
            services.AddAuthorization();
            services.AddEntityFrameworkNpgsql();
            services.AddSignalR(HubOpts);

            var controllersWithViews = services.AddControllersWithViews();
            if (Environment.IsDevelopment())
            {
                controllersWithViews.AddRazorRuntimeCompilation();
            }

            services.AddScoped<LogHitsAttribute>();
            services.AddDbContext<Data.CallaContext>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            if (Environment.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseEndpoints(Endpoints);

            app.UseDefaultFiles(DefaultFileOpts)
                .UseStaticFiles(StaticFileOpts);

            app.UseWebSockets();
        }

        private DefaultFilesOptions DefaultFileOpts
        {
            get
            {
                var defOpts = new DefaultFilesOptions();
                defOpts.DefaultFileNames.Clear();
                var files = Configuration.GetSection("DefaultFiles")?.GetChildren();
                foreach (var file in files)
                {
                    defOpts.DefaultFileNames.Add(file.Value);
                }
                return defOpts;
            }
        }

        private StaticFileOptions StaticFileOpts
        {
            get
            {
                var extTypes = new FileExtensionContentTypeProvider();
                var optionalTypes = Configuration.GetSection("ContentTypes")?.GetChildren();
                if (optionalTypes is object)
                {
                    foreach (var type in optionalTypes)
                    {
                        extTypes.Mappings[type.Key] = type.Value;
                    }
                }

                // required types
                extTypes.Mappings[".glb"] = "model/gltf-binary";
                extTypes.Mappings[".gltf"] = "model/gltf+json";
                extTypes.Mappings[".vert"] = "x-shader/x-vertex";
                extTypes.Mappings[".frag"] = "x-shader/x-fragment";

                var statOpts = new StaticFileOptions
                {
                    ContentTypeProvider = extTypes
                };
                return statOpts;
            }
        }

        private void Endpoints(IEndpointRouteBuilder endpoints)
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}");
            endpoints.MapRazorPages();
            endpoints.MapHub<CallaUserStateHub>("/calla");
        }

        private void HubOpts(HubOptions opts)
        {
            opts.ClientTimeoutInterval = TimeSpan.FromSeconds(5);
            opts.HandshakeTimeout = TimeSpan.FromSeconds(5);
        }

        private void LoggerOpts(ILoggingBuilder builder)
        {
            if (Environment.IsDevelopment())
            {
                builder.AddConsole();
            }
        }
    }
}
