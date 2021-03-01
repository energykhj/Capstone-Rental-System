using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class NotificationType
    {
        public NotificationType()
        {
            Notification = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public string Type { get; set; }

        public virtual ICollection<Notification> Notification { get; set; }
    }
}
