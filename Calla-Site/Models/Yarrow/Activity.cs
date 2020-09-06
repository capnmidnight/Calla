using System.Collections.Generic;

namespace Yarrow.Models
{
    public class Activity
    {
        public int ID { get; set; }
        public string Name { get; set; }
    }

    public class FullActivity : Activity
    {
        public IEnumerable<Transform> Transforms { get; set; }
        public IEnumerable<Station> Stations { get; set; }
        public IEnumerable<GraphEdge> Connections { get; set; }
        public IEnumerable<AudioTrack> AudioTracks { get; set; }
        public IEnumerable<Sign> Signs { get; set; }
    }
}
