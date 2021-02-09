
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
                .ForMember(m => m.Email, opt => opt.MapFrom(x => x.IdNavigation.Email));
            CreateMap<UserDetailsDTO, UserDetails>();
        }
    }
}
