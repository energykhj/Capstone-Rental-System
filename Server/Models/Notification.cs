using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public int? ItemId { get; set; }
        public int? NotiType { get; set; }
        public string Message { get; set; }
        public DateTime? SendDate { get; set; }

        public virtual UserDetails FromUser { get; set; }
        public virtual Item Item { get; set; }
        public virtual NotificationType NotiTypeNavigation { get; set; }
        public virtual UserDetails ToUser { get; set; }
    }
}
