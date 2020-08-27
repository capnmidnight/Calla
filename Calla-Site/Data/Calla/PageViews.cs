using System;
using System.Collections.Generic;

namespace Calla.Data
{
    public partial class PageViews
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public string Referrer { get; set; }
        public DateTime Timestamp { get; set; }
        public string UserAgent { get; set; }
    }
}
