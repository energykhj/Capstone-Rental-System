using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class UserItemPkgDTO
    { 
        public UserItemDTO userItem { get; set; }
        public List<ItemDTO> item { get; set; }
        public List<PhotoDTO> photo { get; set; }
        //public List<addressDTO> address { get; set; }
    }

    public class UserItemDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ItemId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public double Refund { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? TimeStamp { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }
    }

    public class RoleDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
