using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class AudioTracks
    {
        public int Id { get; set; }
        public int TransformId { get; set; }
        public int FileId { get; set; }
        public float Volume { get; set; }
        public float MinDistance { get; set; }
        public float MaxDistance { get; set; }
        public bool AutoPlay { get; set; }
        public bool Loop { get; set; }
        public bool Spatialize { get; set; }
        public string Zone { get; set; }

        public virtual Files File { get; set; }
        public virtual Transforms Transform { get; set; }
        public virtual PlaybackControls PlaybackControls { get; set; }
    }
}
