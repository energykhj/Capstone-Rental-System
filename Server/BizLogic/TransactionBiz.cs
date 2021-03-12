using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.BizLogic
{
    public partial class TransactionBiz
    {
        private readonly PhoenixContext context;

        List<int> errorList = new List<int>();
        Transaction transaction = new Transaction();
        TransactionDetail td = new TransactionDetail();

        public TransactionBiz(PhoenixContext _context)
        {
            this.context = _context;
        }

        public async Task<Transaction> GetTransactionByID(int Id)
        {
            return await context.Transaction
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<List<Transaction>> GetTransactionByBorrower(string userId)
        {
            return await context.Transaction
                .Where(c => c.BorrowerId == userId && 
                        (c.CurrentStatus == (int)TransactionStatusEnum.Request ||   // for cancel 
                        c.CurrentStatus == (int)TransactionStatusEnum.Confirmed ||
                        c.CurrentStatus == (int)TransactionStatusEnum.RequestReturn))
                .ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionByItemId(int itemId)
        {
            return await context.Transaction
                .Where(c => c.ItemId == itemId &&
                        (c.CurrentStatus == (int)TransactionStatusEnum.Request ||   // for cancel 
                        c.CurrentStatus == (int)TransactionStatusEnum.Confirmed ||
                        c.CurrentStatus == (int)TransactionStatusEnum.RequestReturn))
                .ToListAsync();
        }


        public async Task<List<Transaction>> GetTransactionByBorrower(string userId, int status)
        {
            return await context.Transaction
                .Where(c => c.BorrowerId == userId &&
                        (c.CurrentStatus == status))
                .ToListAsync();
        }


        public async Task<List<Transaction>> GetReturnedItem(string userId)
        {
            return await context.Transaction
                .Where(c => c.BorrowerId == userId &&
                        (c.CurrentStatus == (int)TransactionStatusEnum.ReturnComplete))
                .ToListAsync();
        }

        public async Task<Transaction> GetRequestedItem(int itemId)
        {
            return await context.Transaction
                .Where(c => c.ItemId == itemId &&
                        c.CurrentStatus == (int)TransactionStatusEnum.Request)
                .FirstOrDefaultAsync();
        }

        public async Task<Transaction> GetItemByStatus(int itemId, int status)
        {
            return await context.Transaction
                .Include(c => c.TransactionDetail)
                .Where(c => c.ItemId == itemId &&
                        c.CurrentStatus == status)
                .FirstOrDefaultAsync();
        }


        public async Task<Transaction> GetCompletedItem(int itemId)
        {
            return await context.Transaction
                .Where(c => c.ItemId == itemId &&
                        c.CurrentStatus == (int)TransactionStatusEnum.ReturnComplete)
                .FirstOrDefaultAsync();
        }

        public async Task<Transaction> GetRequestReturnItem(int itemId)
        {
            return await context.Transaction
                .Where(c => c.ItemId == itemId &&
                        c.CurrentStatus == (int)TransactionStatusEnum.RequestReturn)
                .FirstOrDefaultAsync();
        }


        public async Task<List<TransactionDetail>> GetTransactionDetails(int Id)
        {
            return await context.TransactionDetail
                .Where(c => c.TransactionId == Id)
                .ToListAsync();
        }

        public async Task<TransactionStatus> GetTransactionStatus(int statusId)
        {
            return await context.TransactionStatus
                .Where(c => c.Id == statusId)
                .OrderByDescending(c => c.Id)
                .FirstOrDefaultAsync();
        }

        public async Task<Transaction> GetTransaction(int Id)
        {
            return await context.Transaction
                .Include(c => c.TransactionDetail)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<String> GetTransactionStatusName(int Id)
        {
            var status = await context.TransactionStatus
                .FirstOrDefaultAsync(c => c.Id == Id);
            return status.Status;
        }

        public async Task<int> GetTransactionStatusID(string name)
        {
            var status = await context.TransactionStatus
                .FirstOrDefaultAsync(c => c.Status == name);
            return status.Id;
        }

        public async Task<int> GetCurrentStatus(int tId)
        {
            var status = await context.Transaction
                .FirstOrDefaultAsync(c => c.Id == tId);
            return status.Id;
        }

       
        public void UpdateTransactionStatus(int itemId, int status)
        {
            // must add code after made table field for currentStatus
        }

        public async Task<Transaction> InsertTransaction(Transaction transaction)
        {
            try
            {
                this.transaction = transaction;
                await ValidateTransaction();
                if (errorList.Count == 0)
                {
                    context.Transaction.Add(transaction);
                    await context.SaveChangesAsync();
                    return await GetTransactionByID(transaction.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Transaction> UpdateTransaction(Transaction transaction)
        {
            try
            {
                this.transaction = transaction;
                await ValidateTransaction();
                if (errorList.Count == 0)
                {
                    context.Transaction.Update(transaction);
                    await context.SaveChangesAsync();
                    return await GetTransactionByID(transaction.Id);
                    //return await GetTransactionStatus((int)transaction.CurrentStatus);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
/*
        public async Task<List<TransactionDetail>> InsertTransactionDetail(TransactionDetail td)
        {
            try
            {
                this.td = td;
                await ValidateTransactionDetails();
                if (errorList.Count == 0)
                {
                    context.TransactionDetail.Add(td);
                    await context.SaveChangesAsync();
                    return await GetTransactionDetails(td.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }*/

        public async Task<TransactionStatus> InsertTransactionDetail(TransactionDetail td)
        {
            try
            {
                this.td = td;
                await ValidateTransactionDetails();
                if (errorList.Count == 0)
                {
                    context.TransactionDetail.Add(td);
                    await context.SaveChangesAsync();
                    return await GetTransactionStatus(td.StatusId);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task ValidateTransaction()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == transaction.BorrowerId);
            if (user == null) errorList.Add(4); // user not found

            var item = await context.Item.FirstOrDefaultAsync(c => c.Id == transaction.ItemId);
            if (item == null) errorList.Add(12); // Item not found
        }
        
        public async Task ValidateTransactionDetails()
        {
            var transaction = await context.Transaction.FirstOrDefaultAsync(c => c.Id == td.TransactionId);
            if (transaction == null) errorList.Add(15); // Related transaction not found

            var item = await context.TransactionStatus.FirstOrDefaultAsync(c => c.Id == td.StatusId);
            if (item == null) errorList.Add(16); // Status not found
        }
    }
}
