namespace Yarrow.Models
{

    public class AudioTrack : AbstractFileAsset
    {
        public int PlaybackTransformID { get; set; }
        public string Zone { get; set; }
        public float Volume { get; set; }
        public float MinDistance { get; set; }
        public float MaxDistance { get; set; }
        public bool AutoPlay { get; set; }
        public bool Loop { get; set; }
        public bool Spatialize { get; set; }
    }
}