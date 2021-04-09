
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
        Confirmed = 2,
        Rejected = 3, 
        CanceledByLender = 4,
        CanceledByBorrower = 5,
        RequestReturn = 6,
        ReturnComplete = 7,
        AskReply = 8
    }

    public enum ManageEnum
    {
        Insert = 1,
        Update = 2,
        Delete = 3
    }
}
