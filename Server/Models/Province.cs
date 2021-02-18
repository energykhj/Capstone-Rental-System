using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Province
    {
        public Province()
        {
            Address = new HashSet<Address>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int CountryId { get; set; }

        public virtual ICollection<Address> Address { get; set; }
    }
}
