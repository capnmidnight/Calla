namespace Yarrow.Models
{
    public class Transform
    {
        public int ID { get; set; }
        public int ParentID { get; set; }
        public string Name { get; set; }
        public float[] Matrix { get; set; }
    }

    public class GraphEdge
    {
        public int FromStationID { get; set; }
        public int ToStationID { get; set; }
    }
}
