using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class Transforms
    {
        public Transforms()
        {
            AudioTracks = new HashSet<AudioTracks>();
            InverseParentTransform = new HashSet<Transforms>();
            PlaybackControls = new HashSet<PlaybackControls>();
            Signs = new HashSet<Signs>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public float[] Matrix { get; set; }
        public string FullPath { get; set; }
        public int ActivityId { get; set; }
        public int? ParentTransformId { get; set; }

        public virtual Activities Activity { get; set; }
        public virtual Transforms ParentTransform { get; set; }
        public virtual Stations Stations { get; set; }
        public virtual ICollection<AudioTracks> AudioTracks { get; set; }
        public virtual ICollection<Transforms> InverseParentTransform { get; set; }
        public virtual ICollection<PlaybackControls> PlaybackControls { get; set; }
        public virtual ICollection<Signs> Signs { get; set; }
    }
}
