using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LookupController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;

        public LookupController(PhoenixContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<Province>>> GetProvinces()
        {
            return await context.Province.ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<List<Category>>> GetCategories()
        {
            return await context.Category.ToListAsync();
        }
    }
}
