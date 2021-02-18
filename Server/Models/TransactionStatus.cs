using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class TransactionStatus
    {
        public TransactionStatus()
        {
            TransactionDetail = new HashSet<TransactionDetail>();
        }

        public int Id { get; set; }
        public string Status { get; set; }

        public virtual ICollection<TransactionDetail> TransactionDetail { get; set; }
    }
}
