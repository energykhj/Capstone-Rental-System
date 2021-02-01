
using AutoMapper;
using Server.Models;
using Shared.DTO;

namespace Server.Helpers
{
    public class AutomapperProfiles : Profile
    {
        public AutomapperProfiles()
        {
            CreateMap<UserDetails, UserDetailsDTO>();
            CreateMap<UserDetailsDTO, UserDetails>();
        }
    }
}
