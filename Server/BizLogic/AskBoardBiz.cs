using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.BizLogic
{
    public partial class AskBoardBiz
    {
        private readonly PhoenixContext context;
        private readonly IFileStorageService fileStorageService;

        AskBoard ab = new AskBoard();
        List<int> errorList = new List<int>();

        public AskBoardBiz(PhoenixContext _context, IFileStorageService _fileStorageService)
        {
            this.context = _context;
            fileStorageService = _fileStorageService;
        }

        public async Task<List<AskBoard>> GetAllArticles()
        {
            return await context.AskBoard
                  .Where(c => c.Id == c.ParentId)
                  .OrderByDescending(c => c.ParentId).ThenBy(c => c.Date)
                  .ToListAsync();
        }

        public async Task<List<AskBoard>> GetArticlesWithReply(int Id)
        {
            return await context.AskBoard
                .Where(c => c.Id == Id || c.ParentId == Id)
                .OrderBy(c => c.ParentId).ThenBy(c => c.Date)
                .ToListAsync();
        }
        public async Task<AskBoard> GetArticle(int Id)
        {
            return await context.AskBoard
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<AskBoard> InsertArticle(AskBoard ab)
        {
            try
            {
                this.ab = ab;
                await ValidateUser();
                if (errorList.Count == 0)
                {
                    context.AskBoard.Add(ab);
                    await context.SaveChangesAsync();

                    int newId = ab.Id;
                    ab.ParentId = newId;
                    await UpdateArticle(ab);
                    return await GetArticle(ab.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AskBoard> InsertReply(AskBoard ab)
        {
            try
            {
                this.ab = ab;
                await ValidateAskParent();
                if (errorList.Count == 0)
                {
                    context.AskBoard.Add(ab);
                    await context.SaveChangesAsync();
                    return await GetArticle(ab.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<AskBoard> UpdateArticle(AskBoard ab)
        {
            try
            {
                this.ab = ab;
                await ValidateAsk();
                if (errorList.Count == 0)
                {
                    DetachedKey(ab);
                    context.AskBoard.Update(ab);
                    await context.SaveChangesAsync();
                    return await GetArticle(ab.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        void DetachedKey(AskBoard ab)
        {
            // to avoid 
            // "The instance of entity type cannot be tracked because another instance of this type with the same key is already being tracked"
            var local = context.Set<AskBoard>()
                                       .Local
                                       .FirstOrDefault(entry => entry.Id.Equals(ab.Id));
            if (local != null)
            {
                context.Entry(local).State = EntityState.Detached;
            }
            context.Entry(ab).State = EntityState.Modified;
        }

        public async Task<bool> DeleteArticle(int Id)
        {
            try
            {
                this.ab = await GetArticle(Id);
                if (ab != null)
                {                   
                    context.AskBoard.Remove(ab);
                    await context.SaveChangesAsync();
                    return true;
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task ValidateUser()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == ab.UserId);
            if (user == null) errorList.Add(4); // user not found
        }
        public async Task ValidateAsk()
        {
            var item = await context.AskBoard.FirstOrDefaultAsync(c => c.Id == ab.Id);
            if (item == null) errorList.Add(18); // Parent article not found
        }
        public async Task ValidateAskParent()
        {
            var item = await context.AskBoard.FirstOrDefaultAsync(c => c.Id == ab.ParentId);
            if (item == null) errorList.Add(18); // Parent article not found
        }
    }
}
