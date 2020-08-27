using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class Stations
    {
        public Stations()
        {
            Activities = new HashSet<Activities>();
            StationConnectionsFromStation = new HashSet<StationConnections>();
            StationConnectionsToStation = new HashSet<StationConnections>();
        }

        public int TransformId { get; set; }
        public int FileId { get; set; }
        public float[] Rotation { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
        public float Altitude { get; set; }
        public string Zone { get; set; }

        public virtual Files File { get; set; }
        public virtual Transforms Transform { get; set; }
        public virtual ICollection<Activities> Activities { get; set; }
        public virtual ICollection<StationConnections> StationConnectionsFromStation { get; set; }
        public virtual ICollection<StationConnections> StationConnectionsToStation { get; set; }
    }
}
