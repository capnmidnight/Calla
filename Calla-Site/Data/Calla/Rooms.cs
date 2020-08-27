using System;
using System.Collections.Generic;

namespace Calla.Data
{
    public partial class Rooms
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public bool Visible { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
