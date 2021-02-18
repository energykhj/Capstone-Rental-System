using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UserItemStatus
    {
        public int Id { get; set; }
        public int UserItemId { get; set; }
        public int ItemStatusId { get; set; }

        public virtual ItemStatus ItemStatus { get; set; }
        public virtual UserItem UserItem { get; set; }
    }
}
