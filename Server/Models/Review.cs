using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Review
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int Rate { get; set; }
        public string Title { get; set; }
        public string Review1 { get; set; }

        public virtual Item Item { get; set; }
    }
}
