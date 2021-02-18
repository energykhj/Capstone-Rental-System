using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Address
    {
        public Address()
        {
            Item = new HashSet<Item>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsDefault { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public int ProvinceId { get; set; }
        public string PostalCode { get; set; }

        public virtual Province Province { get; set; }
        public virtual UserDetails User { get; set; }
        public virtual ICollection<Item> Item { get; set; }
    }
}
