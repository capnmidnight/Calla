using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class Signs
    {
        public int Id { get; set; }
        public int FileId { get; set; }
        public int TransformId { get; set; }
        public bool IsCallout { get; set; }

        public virtual Files File { get; set; }
        public virtual Transforms Transform { get; set; }
    }
}
