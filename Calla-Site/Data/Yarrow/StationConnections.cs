using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class StationConnections
    {
        public int FromStationId { get; set; }
        public int ToStationId { get; set; }

        public virtual Stations FromStation { get; set; }
        public virtual Stations ToStation { get; set; }
    }
}
