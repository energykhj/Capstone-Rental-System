using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AskBoardController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly IFileStorageService fileStorageService;
        private readonly AskBoardBiz AB;
        private readonly UserBiz UB;

        public AskBoardController(PhoenixContext _context, IMapper _mapper, IFileStorageService fileStorageService)
        {
            this.context = _context;
            this.fileStorageService = fileStorageService;
            this.mapper = _mapper;
            AB = new AskBoardBiz(context, fileStorageService);
            UB = new UserBiz(context);
        }

        [HttpGet]
        public async Task<ActionResult<List<AskBoardDTO>>> GetArticleList()
        {
            var articles = mapper.Map<List<AskBoardDTO>>(await AB.GetAllArticles());
            foreach (var article in articles)
            {
                var user = await UB.GetUserAccDetails(article.UserId);
                article.FirstName = user.UserDetails.FirstName;
                article.LastName = user.UserDetails.LastName;
                article.UserName = user.UserDetails.FirstName + " " + user.UserDetails.LastName;
                article.Email = user.Email;
                article.Phone = user.UserDetails.Phone;
                article.PhotoUrl = user.UserDetails.PhotoUrl;
            }

            return articles;
        }

        [HttpGet("GetArticleWithReply")]
        public async Task<ActionResult<List<AskBoardDTO>>> GetArticleWithReply(int Id)
        {
            var articles = mapper.Map<List<AskBoardDTO>>(await AB.GetArticlesWithReply(Id));

            foreach (var article in articles)
            {
                var user = await UB.GetUserAccDetails(article.UserId);
                article.FirstName = user.UserDetails.FirstName;
                article.LastName = user.UserDetails.LastName;
                article.UserName = user.UserDetails.FirstName + " " + user.UserDetails.LastName;
                article.Email = user.Email;
                article.Phone = user.UserDetails.Phone;
                article.PhotoUrl = user.UserDetails.PhotoUrl;
            }

            return articles;
        }

        [HttpPost("InsertArticle")]
        public async Task<ActionResult<AskBoardDTO>> InsertArticle(AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            var result = await AB.InsertArticle(article);
            if (result != null)
                return Ok(result.Id);
            else
                return BadRequest(result);
        }

        [HttpPut("UpdateArticle")]
        public async Task<ActionResult<AskBoardDTO>> UpdteArticle(AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            var result = await AB.UpdateArticle(article);
            if (result != null)
                return Ok(result.Id);
            else
                return BadRequest(result);
        }

        [HttpPost("InsertReply")]
        public async Task<ActionResult<AskBoardDTO>> InsertReply(AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            var result = await AB.InsertReply(article);
            if (result != null)
                return Ok(result.Id);
            else
                return BadRequest(result);
        }

        [HttpPut("UpdateReply")]
        public async Task<ActionResult<AskBoardDTO>> UpdateReply(AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            var result = await AB.UpdateArticle(article);
            if (result != null)
                return Ok(result.Id);
            else
                return BadRequest(result);
        }

        [HttpDelete("DeleteArticle/{id}")]
        public async Task<ActionResult<bool>> DeleteArticle(int Id)
        {
            var cnt = context.AskBoard.Count(c => c.ParentId == Id);
            if (cnt > 1) return BadRequest("Has child article(s), can not remove!");

            var result = await AB.DeleteArticle(Id);
            if (result)
                return Ok(true);
            else
                return BadRequest();
        }

        [HttpDelete("DeleteReply/{id}")]
        public async Task<ActionResult<bool>> DeleteReply(int Id)
        {
            var result = await AB.DeleteArticle(Id);
            if (result)
                return Ok(true);
            else
                return BadRequest();
        }
    }
}
