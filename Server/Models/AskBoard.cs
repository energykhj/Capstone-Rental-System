using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class AskBoard
    {
        public AskBoard()
        {
            InverseParent = new HashSet<AskBoard>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }

        public virtual AskBoard Parent { get; set; }
        public virtual UserDetails User { get; set; }
        public virtual ICollection<AskBoard> InverseParent { get; set; }
    }
}
