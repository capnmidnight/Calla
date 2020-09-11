namespace Yarrow.Models
{
    public abstract class AbstractFileAsset
    {
        public int TransformID { get; set; }
        public int FileID { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
    }
}