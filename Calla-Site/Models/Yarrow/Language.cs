namespace Yarrow.Models
{
    public class Language
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public bool Enabled { get; set; }

        public Lesson[] Lessons { get; set; }
    }
}
