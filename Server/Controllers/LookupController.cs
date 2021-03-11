using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LookupController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IFileStorageService fileStorageService;
        private readonly IMapper mapper;

        public LookupController(PhoenixContext context, IMapper mapper, IFileStorageService fileStorageService)
        {
            this.context = context;
            this.mapper = mapper;
            this.fileStorageService = fileStorageService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Province>>> GetProvinces()
        {
            return await context.Province.ToListAsync();
        }

        [AllowAnonymous]
        [HttpGet("{fileName}")]
        public async Task<ActionResult> GetPhoto(string fileName)
        {
            var file = await fileStorageService.GetFile(fileName);
            return File(file, "application/octet-stream");
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetCategories()
        {
            return await context.Category.ToListAsync();
        }
    }
}
