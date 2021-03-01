using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UserDetails
    {
        public UserDetails()
        {
            Address = new HashSet<Address>();
            AskBoard = new HashSet<AskBoard>();
            Item = new HashSet<Item>();
            NotificationFromUser = new HashSet<Notification>();
            NotificationToUser = new HashSet<Notification>();
            Transaction = new HashSet<Transaction>();
        }

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoUrl { get; set; }
        public string Phone { get; set; }
        public int StatusId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? TimeStamp { get; set; }

        public virtual AspNetUsers LoginUser { get; set; }
        public virtual RecordStatus RecordStatus { get; set; }
        public virtual ICollection<Address> Address { get; set; }
        public virtual ICollection<AskBoard> AskBoard { get; set; }
        public virtual ICollection<Item> Item { get; set; }
        public virtual ICollection<Notification> NotificationFromUser { get; set; }
        public virtual ICollection<Notification> NotificationToUser { get; set; }
        public virtual ICollection<Transaction> Transaction { get; set; }
    }
}
