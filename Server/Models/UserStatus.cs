using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class UserStatus
    {
        public UserStatus()
        {
            UserDetails = new HashSet<UserDetails>();
        }

        public int Id { get; set; }
        public string Status { get; set; }

        public virtual ICollection<UserDetails> UserDetails { get; set; }
    }
}
