namespace Calla.Models
{
    public class TraceKitStackModel
    {
        public string url { get; set; }
        public int lineNo { get; set; }
        public int column { get; set; }
        public string func { get; set; }
        public string[] args { get; set; }
        public string[] context { get; set; }
    }
}
