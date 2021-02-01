using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class UserDetailsDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleNames { get; set; }
        public string PhotoUrl { get; set; }
        public string Phone { get; set; }
        public int? ProvinceId { get; set; }
        public int? CountryId { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }
    }
}
