using System;
using System.Collections.Generic;

namespace Calla.Data
{
    public partial class Errors
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string On { get; set; }
        public string Message { get; set; }
        public string ErrorObject { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
