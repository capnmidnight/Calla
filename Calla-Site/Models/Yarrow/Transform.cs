using Juniper.Mathematics;

namespace Yarrow.Models
{
    public class Transform
    {
        public int ID { get; set; }
        public int ParentID { get; set; }
        public string Name { get; set; }
        public Matrix4x4Serializable Matrix { get; set; }
    }
}
