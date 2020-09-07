using Juniper.World.GIS;

namespace Yarrow.Models
{
    public class Station : AbstractFileAsset
    {
        public bool IsStart { get; set; }

        public string Zone { get; set; }

        public float[] Rotation { get; set; }
        public LatLngPoint Location { get; set; }
    }
}
