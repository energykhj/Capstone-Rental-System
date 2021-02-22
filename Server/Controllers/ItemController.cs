using AutoMapper;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
//using System;
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
        private readonly IFileStorageService fileStorageService;
        private readonly IMapper mapper;
        private readonly ItemBiz IB;
        private readonly UserBiz UB;

        public ItemController(PhoenixContext _context, IFileStorageService fileStorageService, IMapper _mapper)
        {
            this.context = _context;
            this.fileStorageService = fileStorageService;
            this.mapper = _mapper;
            IB = new ItemBiz(context, fileStorageService);
            UB = new UserBiz(context);
        }

        [HttpGet("GetItemsAndDefaultPhoto/{pageSize}")]
        public async Task<ActionResult<List<ItemDTO>>> GetItemsAndDefaultPhoto(int pageSize)
        {
            var Items = await IB.GetItems(pageSize);
            return await GetPackedItemWithDefaultPhoto(Items);
        }

        [HttpGet("GetSearchedItemAndDefaultPhoto/{search}/{pageSize}")]
        public async Task<ActionResult<List<ItemDTO>>> GetSearchedItemAndDefaultPhoto(string search, int pageSize)
        {
            var Items = await IB.GetSearchItem(search, pageSize);
            return await GetPackedItemWithDefaultPhoto(Items);
        }
       
        [HttpPost]
        public async Task<ActionResult<ItemPkgDTO>> InsertItem([FromBody] ItemPkgDTO dto)
        {
            ItemPkgDTO pDto = new ItemPkgDTO();

            var Item = mapper.Map<Item>(dto.Item);
            var Address = mapper.Map<Address>(dto.Address);

            pDto.Address = mapper.Map<AddressDTO>(await UB.InsertAddress(Address));
            Item.AddressId = pDto.Address.Id;
            pDto.Item = mapper.Map<ItemDTO>(await IB.InsertItem(Item));

            return pDto;
        }

        // incluced delete exist file both db and file server
        [HttpPost("SavePhotos")]
        public async Task<ActionResult<List<string>>> SavePhotos()
        {
            try
            {
                var requestForm = Request.Form;
                var itemId = Convert.ToInt32(requestForm.ToArray()[0].Value);
                if (Request.Form.Files.Count > 0)
                {                    
                    var filePathList = await IB.SavePhotos(requestForm, itemId);
                    return Ok(new { filePathList });
                }
                else
                    return BadRequest("No Item Photo file(s)");
            }
            catch (FormatException)
            {
                return BadRequest("ItemId is required(Only integer)");
            }
            catch (Exception ex)
            {
                throw ex.GetBaseException();
            }
        }

        [HttpPut]
        public async Task<ActionResult<ItemPkgDTO>> UpdateItem([FromBody] ItemPkgDTO dto)
        {
            ItemPkgDTO pDto = new ItemPkgDTO();

            var Item = mapper.Map<Item>(dto.Item);
            var Address = mapper.Map<Address>(dto.Address);

            pDto.Address = mapper.Map<AddressDTO>(await UB.UpdateAddress(Address));
            pDto.Item = mapper.Map<ItemDTO>(await IB.UpdateItem(Item));

            return pDto;
        }
               
        private async Task<List<ItemDTO>> GetPackedItemWithDefaultPhoto(List<Item> Items)
        {
            List<ItemDTO> itemDTO = new List<ItemDTO>();
            foreach (var item in Items)
            {
                var PackedItem = mapper.Map<ItemDTO>(item);
                var defaultPhoto = await IB.GetItemDefaultPhoto(item.Id);
                if (defaultPhoto != null)
                    PackedItem.DefaultImageFile = defaultPhoto.FileName;

                itemDTO.Add(PackedItem);
            }
            return itemDTO;
        }

        [HttpGet("GetItem/{itemNum}")]
        public async Task<ActionResult<ItemPkgDTO>> GetItem(int itemNum)
        {
            Item item = await IB.GetItem(itemNum);

            ItemPkgDTO itemPkg = new ItemPkgDTO()
            {
                Item = mapper.Map<ItemDTO>(await IB.GetItem(itemNum)),
                Address = mapper.Map<AddressDTO>(await UB.GetAddress(item.AddressId))
            };

            return itemPkg;
        }
    }

    
}
