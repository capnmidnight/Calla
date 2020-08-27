using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class Activities
    {
        public Activities()
        {
            Transforms = new HashSet<Transforms>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime Timestamp { get; set; }
        public int? StartStationId { get; set; }

        public virtual Stations StartStation { get; set; }
        public virtual ICollection<Transforms> Transforms { get; set; }
    }
}
