using AutoMapper;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authorization;
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
    //[Authorize]
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

        [HttpGet("GetUserItemsAndDefaultPhoto/{currentPage}/{userId}")]
        public async Task<ActionResult<List<ItemPkgDTO>>> GetUserItemsAndDefaultPhoto(int currentPage, string userId)
        {
            List<ItemPkgDTO> dtoPkgList = new List<ItemPkgDTO>();

            var Items = await IB.GetItems(userId, currentPage);
            foreach (Item item in Items)
            {
                var Add = await IB.GetItemAddress(item.AddressId);
                var Photo = await IB.GetItemDefaultPhoto(item.Id);

                ItemPkgDTO dto = new ItemPkgDTO()
                {
                    Item = mapper.Map<ItemDTO>(item),
                    Address = mapper.Map<AddressDTO>(Add)
                };               
                dto.Item.DefaultImageFile = (Photo == null) ? null : Photo.FileName;

                dtoPkgList.Add(dto);
            }
            return dtoPkgList;
        }

       /* [AllowAnonymous]
        [HttpGet("GetSearchedItemAndDefaultPhoto/{currentPage}/{search?}")]
        public async Task<ActionResult<List<ItemDTO>>> GetSearchedItemAndDefaultPhoto(int currentPage, string search = null)
        {
            if (string.IsNullOrEmpty(search) || search == "null") search = "";
            var Items = await IB.GetSearchItem(search, currentPage);
            return await GetPackedItemWithDefaultPhoto(Items);
        }*/

        [AllowAnonymous]
        [HttpGet("GetSearchedItemAndDefaultPhoto/{currentPage}/{search?}/{city?}")]
        public async Task<ActionResult<List<ItemDTO>>> GetSearchedItemAndDefaultPhoto(int currentPage, string search = null, string city = null)
        {
            if (string.IsNullOrEmpty(search) || search == "null") search = "";
            if (string.IsNullOrEmpty(city) || city == "null") city = "";
            var cityList = context.Address.Where(c => c.City == city).Select(c => c.Id).ToList();

            if (string.IsNullOrEmpty(search) || search == "null") search = "";
            var Items = await IB.GetSearchItem(currentPage, search, cityList);
            return await GetPackedItemWithDefaultPhoto(Items);
        }

        [AllowAnonymous]
        [HttpGet("GetItemPhotos/{itemId}")]
        public async Task<ActionResult<List<PhotoDTO>>> GetItemPhotos(int itemId)
        {
            return mapper.Map<List<PhotoDTO>>(await IB.GetItemPhotos(itemId));
        }

        [AllowAnonymous]
        [HttpGet("GetCityOfAddress")]
        public List<string> GetCityOfAddress()
        {
            return context.Address.Select(c => c.City).Distinct().ToList();
        }

        [HttpPost]
        public async Task<ActionResult<ItemPkgDTO>> InsertItem([FromBody] ItemPkgDTO dto)
        {
            ItemPkgDTO pDto = new ItemPkgDTO();

            var Item = mapper.Map<Item>(dto.Item);
            var Address = mapper.Map<Address>(dto.Address);

            if (Address.IsDefault)
                Item.AddressId = Address.Id;
            else
            {
                pDto.Address = mapper.Map<AddressDTO>(await UB.InsertAddress(Address));
                Item.AddressId = pDto.Address.Id;
            }
            
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
                var filePathList = await IB.SavePhotos(requestForm, itemId);
                return Ok(new { filePathList });
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
                ItemPkgDTO pDto = new ItemPkgDTO();

                if (Address.IsDefault)
                    Item.AddressId = Address.Id;
                else
                {
                    pDto.Address = mapper.Map<AddressDTO>(await UB.UpdateAddress(Address));
                    Item.AddressId = pDto.Address.Id;
                }

                pDto.Item = mapper.Map<ItemDTO>(await IB.UpdateItem(Item));

                return pDto;
            }
            else return BadRequest("No Item and Address details");
        }

        [HttpGet("GetItemReview/{itemID}")]
        public async Task<ActionResult<List<ItemReviewPkgDTO>>>GetItemReview(int itemID)
        {
            List<ItemReviewPkgDTO> dtoPkgList = new List<ItemReviewPkgDTO>();
            
            var Reviews = await IB.GetReviewList(itemID);
            foreach (Review review in Reviews)
            {
                ItemReviewPkgDTO dto = new ItemReviewPkgDTO()
                {
                    Item = mapper.Map<ItemDTO>(review.Item),
                    Review = mapper.Map<ReviewDTO>(review)                   
                };

                var user = await UB.GetUserDetails(dto.Review.UserId);
                dto.Review.UserName = user.FirstName + " " + user.LastName;

                dtoPkgList.Add(dto);
            }
            return dtoPkgList;
        }


        [HttpGet("GetItemReviewAvg/{itemID}")]
        public async Task<ActionResult<double>> GetItemReviewAvg(int itemID)
        {
            var Reviews = await IB.GetReviewList(itemID);
            double SumOfItemRate = Reviews.Sum(c => c.Rate);
            double avg = SumOfItemRate / Reviews.Count();

            return avg;
        }


        [HttpGet("GetOwnerRateAndItems/{userId}")]
        public async Task<ActionResult<List<string>>> GetOwnerRateAndItems(string userId)
        {
            List<string> OwnerRateAndItems = new List<string>();
            var ItemsbyUser = await IB.GetItems(userId, 1);
            
            if (ItemsbyUser == null) return null;

            double rateSum = 0;
            int cnt = 0;
            foreach (Item item in ItemsbyUser)
            {
                var rv = await IB.GetReviewList(item.Id);
                cnt += rv.Count();
                rateSum += rv.Sum(c => c.Rate);
            }
            OwnerRateAndItems.Add(cnt.ToString());
            OwnerRateAndItems.Add((cnt != 0)? (rateSum / cnt).ToString() : "0");

            
            return OwnerRateAndItems;
        }

        [HttpPost("InsertReview")]
        public async Task<ActionResult<ItemReviewPkgDTO>> InsertReview([FromBody] Review review)
        {
            ItemReviewPkgDTO pDto = new ItemReviewPkgDTO()
            {
                Review = mapper.Map<ReviewDTO>(await IB.InsertReview(review)),
                Item = mapper.Map<ItemDTO>(await IB.GetItem(review.ItemId))
            };
            return pDto;
        }

        [HttpPut("UpdateReview")]
        public async Task<ActionResult<ItemReviewPkgDTO>> UpdateReview([FromBody] Review review)
        {
            //var review = mapper.Map<Review>(rv);

            ItemReviewPkgDTO pDto = new ItemReviewPkgDTO()
            {
                Review = mapper.Map<ReviewDTO>(await IB.UpdateReview(review)),
                Item = mapper.Map<ItemDTO>(await IB.GetItem(review.ItemId))
            };
            return pDto;
        }

        [HttpDelete("DeleteReview/{reviewId}")]
        public async Task<ActionResult<bool>> DeleteReview(int reviewId)
        {
            var result = await IB.DeleteReview(reviewId);
            if (result)
                return Ok(true);
            else
                return BadRequest();
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
