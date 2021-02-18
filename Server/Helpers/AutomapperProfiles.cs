
using AutoMapper;
using Server.Models;
using Shared.DTO;

namespace Server.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<UserDetails, UserDetailsDTO>()
                .ForMember(m => m.Email, opt => opt.MapFrom(x => x.LoginUser.Email))
                .ForMember(m => m.StatusName, opt => opt.MapFrom(x => x.RecordStatus.Status));
            CreateMap<UserDetailsDTO, UserDetails>();

            CreateMap<ItemDTO, Item>();
            CreateMap<Item, ItemDTO>()
                .ForMember(m => m.CategoryName, opt => opt.MapFrom(x => x.Category.Name))         
                .ForMember(m => m.StatusName, opt => opt.MapFrom(x => x.RecordStatus.Status));           

            CreateMap<UserItemDTO, UserItem>();
            CreateMap<UserItem, UserItemDTO>()
                .ForMember(m => m.StatusName, opt => opt.MapFrom(x => x.Status));

            CreateMap<PhotoDTO, Photo>();
            CreateMap<Photo, PhotoDTO>();

            CreateMap<AddressDTO, Address>();
            CreateMap<Address, AddressDTO>()
                .ForMember(m => m.ProvinceName, opt => opt.MapFrom(x => x.Province.Name))
                .ForMember(m => m.ProvinceCode, opt => opt.MapFrom(x => x.Province.Code));

            CreateMap<UserAccountDTO, AspNetUsers>();
            CreateMap<AspNetUsers, UserAccountDTO>();
        }
    }
}
