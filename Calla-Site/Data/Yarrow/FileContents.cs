using System;
using System.Collections.Generic;

namespace Yarrow.Data
{
    public partial class FileContents
    {
        public int FileId { get; set; }
        public byte[] Data { get; set; }

        public virtual Files File { get; set; }
    }
}
