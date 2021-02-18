
namespace Shared.Helpers
{    
    public enum RecordStatusEnum
    {
        New = 1,
        Active = 2,
        Inactive = 3
    }

    public enum TransactionStatusEnum
    {
        Request = 1,
        confirmed = 2,
        Rejected = 3, 
        CanceledByLender = 4,
        CanceledByBorrower = 5,
        Borrowed = 6,
        RequestReturn = 7,
        ReturnComplete = 8
    }
}
