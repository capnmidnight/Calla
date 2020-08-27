using System;
using System.Collections.Generic;

namespace Calla.Data
{
    public partial class Contacts
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime Timestamp { get; set; }
        public string Room { get; set; }
    }
}
