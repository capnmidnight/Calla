using Calla.Data;
using Calla.Models;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

using System;
using System.Linq;
using System.Threading.Tasks;

namespace Calla.Controllers
{
    static class AdminExt
    {
        public static StringCount[] ValueCount<T>(this DbSet<T> set, Func<T, string> select)
            where T : class
        {
            return set.Select(select)
                .GroupBy(v => v)
                .Select(g => new StringCount
                {
                    Value = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(c => c.Count)
                .ThenBy(c => c.Value)
                .ToArray();
        }
    }

    public class AdminController : Controller
    {
        private readonly IWebHostEnvironment env;
        private readonly CallaContext db;

        public AdminController(IWebHostEnvironment env, CallaContext db)
        {
            this.env = env;
            this.db = db;
        }

        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult PageViews()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var views = db.PageViews
                .OrderBy(v => v.From)
                .ThenBy(v => v.Timestamp)
                .ToArray();

            return View(views);
        }

        [HttpDelete]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> PageViews([FromBody] int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var pvs = db.PageViews.Where(v => v.Id == id);
            db.PageViews.RemoveRange(pvs);
            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Referrers()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.PageViews.ValueCount(pv => pv.Referrer));
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Domains()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.PageViews
                .Where(pv => pv.Referrer != "N/A")
                .AsEnumerable()
                .Select(pv => new Uri(pv.Referrer))
                .Select(uri => uri.Host.StartsWith("www.", StringComparison.InvariantCultureIgnoreCase)
                    ? uri.Host.Substring(4)
                    : uri.Host)
                .GroupBy(host => host)
                .Select(g => new StringCount
                {
                    Value = g.Key,
                    Count = g.Count()
                })
                .ToArray());
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult UserAgents()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.PageViews.ValueCount(pv => pv.UserAgent));
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Contacts()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Contacts.ToArray());
        }

        [HttpDelete]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Contacts([FromBody] int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var cs = db.Contacts.Where(v => v.Id == id);
            db.Contacts.RemoveRange(cs);
            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Rooms()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            return View(db.Rooms.ToArray());
        }

        [HttpPost]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Rooms([FromBody] Rooms room)
        {
            if (!env.IsDevelopment()
                || room is null)
            {
                return NotFound();
            }

            if (room.Id > 0)
            {
                var cur = await db.Rooms.SingleOrDefaultAsync(r => r.Id == room.Id)
                    .ConfigureAwait(false);
                if (!string.IsNullOrEmpty(room.Name))
                {
                    cur.Name = room.Name;
                }

                if (!string.IsNullOrEmpty(room.ShortName))
                {
                    cur.ShortName = room.ShortName;
                }

                cur.Visible = room.Visible;

                cur.Timestamp = DateTime.Now;
            }
            else
            {
                db.Rooms.Add(room);
            }

            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }

        [HttpDelete]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Rooms([FromBody] int id)
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var cs = db.Rooms.Where(v => v.Id == id);
            db.Rooms.RemoveRange(cs);
            await db.SaveChangesAsync().ConfigureAwait(false);
            return Ok();
        }
    }
}
