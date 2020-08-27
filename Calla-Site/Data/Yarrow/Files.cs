using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class Files
    {
        public Files()
        {
            AudioTracks = new HashSet<AudioTracks>();
            Signs = new HashSet<Signs>();
            Stations = new HashSet<Stations>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Mime { get; set; }
        public DateTime Timestamp { get; set; }
        public int Size { get; set; }

        public virtual FileContents FileContents { get; set; }
        public virtual ICollection<AudioTracks> AudioTracks { get; set; }
        public virtual ICollection<Signs> Signs { get; set; }
        public virtual ICollection<Stations> Stations { get; set; }
    }
}
