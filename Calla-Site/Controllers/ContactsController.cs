using Calla.Data;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

using System.Linq;
using System.Threading.Tasks;

namespace Calla.Controllers
{
    public class ContactsController : Controller
    {
        private readonly IWebHostEnvironment env;
        private readonly CallaContext db;

        public ContactsController(IWebHostEnvironment env, CallaContext db)
        {
            this.env = env;
            this.db = db;
        }

        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Index()
        {
            if (!env.IsDevelopment())
            {
                return NotFound();
            }

            var contacts = db.Contacts
                .OrderBy(contact => contact.Id)
                .ToArray();

            return View(contacts);
        }

        [HttpPost]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<ActionResult> Index([FromBody] Contacts contact)
        {
            if (contact != null
                && !db.Contacts.Any(c => c.Email == contact.Email))
            {
                _ = await db.Contacts.AddAsync(contact).ConfigureAwait(false);
                await db.SaveChangesAsync().ConfigureAwait(false);
            }

            return Ok();
        }
    }
}
