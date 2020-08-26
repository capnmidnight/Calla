using Juniper.Mathematics;
using Juniper.World.GIS;

namespace Yarrow.Models
{
    public class Station
    {
        public int ID { get; set; }
        public int FileID { get; set; }

        public string Zone { get; set; }

        public QuaternionSerializable Rotation { get; set; }
        public LatLngPoint Location { get; set; }
    }
}
