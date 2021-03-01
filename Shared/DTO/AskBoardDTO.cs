using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class AskBoardPkgDTO
    {
        public AskBoardDTO AskParent { get; set; }
        public AskBoardDTO AskChild { get; set; }
    }

    public class AskBoardDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? ParentId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PhotoUrl { get; set; }
        public string Phone { get; set; }
    }
}
