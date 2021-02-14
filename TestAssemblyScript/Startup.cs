using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace TestAssemblyScript
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
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddLogging(options =>
            {
                if (Environment.IsDevelopment())
                {
                    options.AddConsole();
                }
            });

            var razorPages = services.AddRazorPages();
            if (Environment.IsDevelopment())
            {
                razorPages.AddRazorRuntimeCompilation();
            }
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
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();


            app.UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                    endpoints.MapRazorPages();
                });

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

                var statOpts = new StaticFileOptions
                {
                    ContentTypeProvider = extTypes
                };
                return statOpts;
            }
        }
    }
}
