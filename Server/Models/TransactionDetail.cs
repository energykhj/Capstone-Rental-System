using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class TransactionDetail
    {
        public int Id { get; set; }
        public int TransactionId { get; set; }
        public int StatusId { get; set; }
        public DateTime Date { get; set; }
        public string Reason { get; set; }

        public virtual TransactionStatus Status { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}
