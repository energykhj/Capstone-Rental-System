using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class ItemPkgDTO
    {
        public ItemDTO Item { get; set; }
        public AddressDTO Address { get; set; }
        //public List<PhotoDTO> Photo { get; set; }
    }

    public class ItemReviewPkgDTO
    {
        public ItemDTO Item { get; set; }
        public ReviewDTO Review{ get; set; }
    }

    public class ItemDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultImageFile { get; set; }
        public float? Deposit { get; set; }
        public float? Fee { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int AddressId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime TimeStamp { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }
    }


    public class ItemAddressDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DefaultImageFile { get; set; }
        public float? Deposit { get; set; }
        public float? Fee { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int AddressId { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string ProvinceName { get; set; }
        public string ProvinceCode { get; set; }
        public string PostalCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime TimeStamp { get; set; }
        public int? StatusId { get; set; }
        public string StatusName { get; set; }
    }

    public class PhotoDTO
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public bool isDefault { get; set; }
        public string FileName { get; set; }
    }

    public class ReviewDTO
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int Rate { get; set; }
        public string Title { get; set; }
        public string Review1 { get; set; }
        public DateTime Date { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        
    }
}
