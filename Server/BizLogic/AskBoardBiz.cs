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
            var a = await context.AskBoard
                .Where(c => c.Id == c.ParentId)
                .OrderByDescending(c => c.ParentId).ThenBy(c => c.Date)
                .ToListAsync();
            return a;
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
                //await ValidateItem();
                if (errorList.Count == 0)
                {
                    //SetUserDetailsDefaultValues();
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
                //await ValidateItem();
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
                //await ValidateItem();
                if (errorList.Count == 0)
                {
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


    }
}
