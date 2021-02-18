using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class ItemStatus
    {
        public ItemStatus()
        {
            UserItem = new HashSet<UserItem>();
        }

        public int Id { get; set; }
        public string Status { get; set; }

        public virtual ICollection<UserItem> UserItem { get; set; }
    }
}
