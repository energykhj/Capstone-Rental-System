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
    [Authorize]
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
        public async Task<ActionResult<List<AskBoardDTO>>> GetAllBoardArticles()
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

        [HttpPost("InsertArticle")]
        public async Task<ActionResult<AskBoardDTO>> InsertArticle([FromBody] AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            return mapper.Map<AskBoardDTO>(await AB.InsertArticle(article));
        }


        [HttpPost("InsertReply")]
        public async Task<ActionResult<AskBoardDTO>> InsertReply([FromBody] AskBoardDTO dto)
        {
            var article = mapper.Map<AskBoard>(dto);
            return mapper.Map<AskBoardDTO>(await AB.InsertReply(article));
        }


    }
}
