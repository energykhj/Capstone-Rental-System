using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Province
    {
        public Province()
        {
            UserDetails = new HashSet<UserDetails>();
        }

        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? CountryId { get; set; }

        public virtual ICollection<UserDetails> UserDetails { get; set; }
    }
}
