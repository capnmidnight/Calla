namespace Yarrow.Models.Admin
{
    public class AudioTrack : Models.AudioTrack
    {
        public int ID { get; set; }

        public string FileName { get; set; }
        public string Mime { get; set; }

        public string ActivityName { get; set; }
    }
}