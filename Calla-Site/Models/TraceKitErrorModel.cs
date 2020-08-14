namespace Calla.Models
{
    public class TraceKitErrorModel
    {
        public string userAgent { get; set; }
        public string name { get; set; }
        public string message { get; set; }
        public string mode { get; set; }
        public TraceKitStackModel[] stack { get; set; }
    }
}
