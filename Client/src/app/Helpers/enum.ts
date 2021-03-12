export enum RecordStatusEnum {
  New = 1,
  Active = 2,
  Inactive = 3,
}

export enum TransactionStatusEnum {
  Request = 1,
  Confirmed = 2,
  Rejected = 3,
  CanceledByLender = 4,
  CanceledByBorrower = 5,
  RequestReturn = 6,
  ReturnComplete = 7,
}