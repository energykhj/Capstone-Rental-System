using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Item
    {
        public Item()
        {
            Photo = new HashSet<Photo>();
            Review = new HashSet<Review>();
            Transaction = new HashSet<Transaction>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float? Deposit { get; set; }
        public float? Fee { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int AddressId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }

        public virtual Address Address { get; set; }
        public virtual Category Category { get; set; }
        public virtual RecordStatus RecordStatus { get; set; }
        public virtual UserDetails User { get; set; }
        public virtual ICollection<Photo> Photo { get; set; }
        public virtual ICollection<Review> Review { get; set; }
        public virtual ICollection<Transaction> Transaction { get; set; }
    }
}
