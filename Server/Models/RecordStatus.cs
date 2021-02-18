using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class RecordStatus
    {
        public RecordStatus()
        {
            Item = new HashSet<Item>();
            UserDetails = new HashSet<UserDetails>();
        }

        public int Id { get; set; }
        public string Status { get; set; }

        public virtual ICollection<Item> Item { get; set; }
        public virtual ICollection<UserDetails> UserDetails { get; set; }
    }
}
