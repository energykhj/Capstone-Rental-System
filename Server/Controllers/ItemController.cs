using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly ItemBiz IB;
        private readonly UserBiz UB;

        public ItemController(PhoenixContext _context, IMapper _mapper)
        {
            this.context = _context;
            this.mapper = _mapper;
            IB = new ItemBiz(context);
            UB = new UserBiz(context);
        }

        [HttpPost]
        public async Task<ActionResult<ItemDTO>> Post([FromBody] ItemPkgDTO dto)
        {
            var Item = mapper.Map<Item>(dto.Item);
            var Address = mapper.Map<Address>(dto.Address);
            var Photo = mapper.Map<Photo>(dto.Photo);

            var newAddress = mapper.Map<AddressDTO>(await UB.InsertAddress(Address));
            Item.AddressId = newAddress.Id;
            var newItem = mapper.Map<ItemDTO>(await IB.InsertItem(Item));
            Photo.ItemId = newItem.Id;
            //var newPhoto = mapper.Map<PhotoDTO>(await IB.InsertItemPhotos(Item));


            return newItem;
        }
    }

    
}
