using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Photo
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string FileName { get; set; }

        public virtual Item Item { get; set; }
    }
}
