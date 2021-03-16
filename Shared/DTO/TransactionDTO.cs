using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class TransactionPkgDTO
    {
        public TransactionDTO Trans { get; set; }
        public TransactionDetailsDTO TranDetails { get; set; }
    }
    public class ItemTransactionListPkgDTO
    {
        public ItemDTO Item { get; set; }
        public List<TransactionDTO> Trans { get; set; }
    }

    public class ItemTransactionPkgDTO
    {
        public ItemDTO Item { get; set; }
        public TransactionDTO Trans { get; set; }
    }

    public class TransactionStatusListDTO
    {
        public List<TransactionStatusDTO> statusList { get; set; }
    }

    public class TransactionDTO
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string BorrowerId { get; set; }
        public string BorrowerName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime requestDate { get; set; }
        public string Reason { get; set; }
        public float? Total { get; set; }
        public float? Deposit { get; set; }
        public float? RefundDeposit { get; set; }
        public int? CurrentStatus { get; set; }
        public string StatusName{ get; set; }
    }

    public class TransactionDetailsDTO
    {
        public int Id { get; set; }
        public int TransactionId { get; set; }
        public int StatusId { get; set; }
        public string StatusName { get; set; }
        public string Reason { get; set; }
        public DateTime Date { get; set; }
    }

    public class TransactionStatusDTO
    {
        public int Id { get; set; }
        public string Status { get; set; }
    }

}
