﻿using AutoMapper;
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

        [HttpGet("GetSearchedItemAndDefaultPhoto/{currentPage}/{search?}")]
        public async Task<ActionResult<List<ItemDTO>>> GetSearchedItemAndDefaultPhoto(int currentPage, string search = null)
        {
            if (string.IsNullOrEmpty(search) || search == "null") search = "";
            var Items = await IB.GetSearchItem(search, currentPage);
            return await GetPackedItemWithDefaultPhoto(Items);
        }
        
        [HttpGet("GetItemPhotos/{itemId}")]
        public async Task<ActionResult<List<PhotoDTO>>> GetItemPhotos(int itemId)
        {
            return mapper.Map<List<PhotoDTO>>(await IB.GetItemPhotos(itemId));
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

        // included delete exist file both db and file server
        [HttpPost("SavePhotos")]
        public async Task<ActionResult<List<string>>> SavePhotos()
        {
            try
            {
                var requestForm = Request.Form;
                var itemId = Convert.ToInt32(requestForm.ToArray()[0].Value);
                //if (Request.Form.Files.Count > 0)
                //{
                    var filePathList = await IB.SavePhotos(requestForm, itemId);
                    return Ok(new { filePathList });
                //}
                //else
                //    return BadRequest("No Item Photo file(s)");
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
            var Item = mapper.Map<Item>(dto.Item);
            var Address = mapper.Map<Address>(dto.Address);
            if (Item != null && Address != null)
            {
                ItemPkgDTO pDto = new ItemPkgDTO()
                {
                    Address = mapper.Map<AddressDTO>(await UB.UpdateAddress(Address)),
                    Item = mapper.Map<ItemDTO>(await IB.UpdateItem(Item))
                };

                return pDto;
            }
            else return BadRequest("No Item and Address details");
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
            ItemPkgDTO pDto = new ItemPkgDTO();
            var Item = mapper.Map<ItemDTO>(await IB.GetItem(itemNum));

            if (Item != null)
            {
                var Address = mapper.Map<AddressDTO>(await UB.GetAddress(Item.AddressId));
                pDto.Item = Item;
                pDto.Address = Address;
                return pDto;
            }
            else
            {
                return BadRequest("Item is not found");
            }
        }

    }


}
