using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Transaction
    {
        public Transaction()
        {
            TransactionDetail = new HashSet<TransactionDetail>();
        }

        public int Id { get; set; }
        public int ItemId { get; set; }
        public string BorrowerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public float? RefundDeposit { get; set; }
        public int? CurrentStatus { get; set; }

        public virtual UserDetails Borrower { get; set; }
        public virtual Item Item { get; set; }
        public virtual ICollection<TransactionDetail> TransactionDetail { get; set; }
    }
}
