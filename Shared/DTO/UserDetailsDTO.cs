using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class UserPkgDTO
    {        
        public UserAccountDTO Account { get; set; }
        public UserDetailsDTO Details { get; set; }
        //public List<AddressDTO> Addresses { get; set; }
        public AddressDTO Address { get; set; }
    }

    public class UserAccountDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
        //public string PasswordHash { get; set; }
    }

    public class UserDetailsDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleNames { get; set; }
        public string PhotoUrl { get; set; }
        public string Phone { get; set; }
       /* public bool isDefault { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public int? ProvinceId { get; set; }
        public int? CountryId { get; set; }*/
        public DateTime? CreatedDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }
    }

    public class AddressDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsDefault { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public int ProvinceId { get; set; }
        public string ProvinceCode { get; set; }
        public string ProvinceName { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
    }
}
