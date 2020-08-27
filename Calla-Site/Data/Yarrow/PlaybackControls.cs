using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class PlaybackControls
    {
        public int AudioTrackId { get; set; }
        public int TransformId { get; set; }

        public virtual AudioTracks AudioTrack { get; set; }
        public virtual Transforms Transform { get; set; }
    }
}
