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

        public async Task<Transaction> GetTransactionByItem(int Id)
        {
            return await context.Transaction
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Transaction> GetTransactionByBorrower(string userId)
        {
            return await context.Transaction
                .FirstOrDefaultAsync(c => c.BorrowerId == userId);
        }

        public async Task<List<TransactionDetail>> GetTransactionDetails(int Id)
        {
            return await context.TransactionDetail
                .Where(c => c.TransactionId == Id)
                .ToListAsync();
        }

       /* public async Task<Transaction> GetTransaction(int Id)
        {
            return await context.Transaction
                .Include(c => c.TransactionDetail)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }*/

        public async Task<int> GetTransactionStatus(int Id)
        {
            var status = await context.TransactionStatus
                .FirstOrDefaultAsync(c => c.Id == Id);
            return status.Id;
        }

        public void UpdateTransactionDetail(TransactionDetail td)
        {
            // No need Transaction detail's update, only insert 
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
                    return await GetTransactionByItem(transaction.Id);
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
                    return await GetTransactionByItem(transaction.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

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
