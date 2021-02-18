using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UserItem
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ItemId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double Refund { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }
        public DateTime? RequestReturnDate { get; set; }
        public DateTime? ReturnCompleteDate { get; set; }
        public string Reason { get; set; }

        public virtual Item Item { get; set; }
        public virtual ItemStatus Status { get; set; }
        public virtual UserDetails User { get; set; }
    }
}
