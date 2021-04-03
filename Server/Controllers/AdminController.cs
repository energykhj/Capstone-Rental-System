using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        public AdminController(PhoenixContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet("GetCategories")]
        public async Task<List<Category>> GetCategories()
        {
            return await context.Category.OrderBy(c => c.CategoryId).ToListAsync();
        }
        
        [HttpPut("ManageCategory")]
        public async Task<ActionResult<List<Category>>> ManageCategory(AdminCategoryDTO dto)
        {
            var cate = await GetCategory(dto.Id);
            switch (dto.option)
            {
                case (int)ManageEnum.Insert:
                    Category newC = new Category() { Name = dto.Name };
                    context.Category.Add(newC);
                    break;
                case (int)ManageEnum.Update:
                    cate.Name = dto.Name;
                    context.Category.Update(cate);
                    break;
                // not allow to delete previous category               
                default:
                    return BadRequest("Bad option");
            }
            await context.SaveChangesAsync();
            return await GetCategories();
        }

        private async Task<Category> GetCategory(int id)
        {
            return await context.Category.Where(c => c.CategoryId == id).FirstOrDefaultAsync();
        }
    }
}
