using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UserDetails
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleNames { get; set; }
        public string PhotoUrl { get; set; }
        public string Phone { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public int? ProvinceId { get; set; }
        public int? CountryId { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }

        public virtual AspNetUsers IdNavigation { get; set; }
        public virtual Province Province { get; set; }
        public virtual UserStatus Status { get; set; }
    }
}
