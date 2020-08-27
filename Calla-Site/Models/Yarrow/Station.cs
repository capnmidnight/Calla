using Juniper.Mathematics;
using Juniper.World.GIS;

namespace Yarrow.Models
{
    public class Station
    {
        public int TransformID { get; set; }
        public int FileID { get; set; }
        public bool IsStart { get; set; }

        public string Zone { get; set; }

        public float[] Rotation { get; set; }
        public LatLngPoint Location { get; set; }
    }
}
