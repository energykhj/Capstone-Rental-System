using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Server.BizLogic
{
    public partial class ItemBiz
    {
        private readonly PhoenixContext context;
        private readonly IFileStorageService fileStorageService;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };
        private readonly int PAGE_SIZE = 8;

        Item item = new Item();
        Photo photo = new Photo();
        Review review = new Review();

        List<int> errorList = new List<int>();

        public ItemBiz(PhoenixContext _context)
        {
            this.context = _context;
        }

        public ItemBiz(PhoenixContext _context, IFileStorageService _fileStorageService)
        {
            this.context = _context;
            fileStorageService = _fileStorageService;
        }

        public void SetUserDetailsDefaultValues()
        {
            item.CreatedDate = DateTime.UtcNow;
            item.TimeStamp = DateTime.UtcNow;
            item.StatusId = (int)RecordStatusEnum.New;
        }

        public async Task<List<Item>> GetItems(int currentPage)
        {
            return await context.Item
                .Include(c => c.Category)
                .Include(c => c.RecordStatus)
                .OrderByDescending(c => c.Id)
                .Skip((currentPage - 1) * PAGE_SIZE).Take(PAGE_SIZE)
                .ToListAsync();
        }

        public async Task<Item> GetItem(int Id)
        {
            return await context.Item
                .Include(c => c.Photo)
                .Include(c => c.Category)
                .Include(c => c.RecordStatus)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<List<Item>> GetItems(string userId, int currentPage = 1)
        {
            return await context.Item
                .Include(c => c.Category)
                .Include(c => c.Photo)
                .Include(c => c.Address)
                .Include(c => c.RecordStatus)
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.Id)
                //.Skip((currentPage - 1) * PAGE_SIZE).Take(PAGE_SIZE)
                .ToListAsync();
        }

        public async Task<List<Item>> GetItemTransaction(string userId, int currentPage = 1)
        {
            return await (
               from i in context.Item
               join t in context.Transaction on i.Id equals t.ItemId
               where t.BorrowerId == userId
                select i)
               .Include(c => c.Category)
               .Include(c => c.Photo)
               .Include(c => c.Address)
               .Include(c => c.RecordStatus)
               .OrderByDescending(c => c.Id)
               //.Skip((currentPage - 1) * PAGE_SIZE).Take(PAGE_SIZE)
               .ToListAsync();
        }

        public async Task<List<Photo>> GetItemPhotos(int itemId)
        {
            return await context.Photo
               .Where(c => c.ItemId == itemId)
               .ToListAsync();
        }

        public async Task<Photo> GetItemPhoto(int Id)
        {
            return await context.Photo.FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Photo> GetItemDefaultPhoto(int itemId)
        {
            return await context.Photo
                                .Where(c => c.ItemId == itemId)
                                .FirstOrDefaultAsync();
                                //.FirstOrDefaultAsync(c => c.IsDefault == true);
        }

        public async Task<List<Item>> GetSearchItem(string strSearch, int currentPage)
        {
            return await context.Item
                .Include(c => c.Category)
                .Include(c => c.RecordStatus)
                .OrderByDescending(c => c.Id)
                .Where(c => c.Name.ToUpper().Contains(strSearch) ||
                       c.Description.ToUpper().Contains(strSearch))
                .Skip((currentPage - 1) * PAGE_SIZE).Take(PAGE_SIZE)
                .OrderByDescending(c => c.Id)
                .ToListAsync();
        }

        public async Task<Address> GetItemAddress(int addId)
        {
            return await context.Address
                                .Where(c => c.Id == addId)
                                .FirstOrDefaultAsync();
            //.FirstOrDefaultAsync(c => c.IsDefault == true);
        }

        public async Task<Review> GetReview(int Id)
        {
            return await context.Review
                .Include(c => c.Item)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<List<Review>> GetReviewList(int itemId)
        {
            return await context.Review
                .Include(c => c.Item)
                .Where(c => c.ItemId == itemId)
                .OrderBy(c => c.Date)
                .ToListAsync();
        }

        public int GetRateSumByItem(int itemId)
        {
            return context.Review
                .Include(c => c.Item)
                .Where(c => c.ItemId == itemId)
                .Sum(c => c.Rate);
        }

        public async Task<Item> InsertItem(Item item)
        {
            try
            {
                this.item = item;
                await ValidateItem();
                if (errorList.Count == 0)
                {
                    SetUserDetailsDefaultValues();
                    context.Item.Add(item);
                    await context.SaveChangesAsync();
                    return await GetItem(item.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<Item> UpdateItem(Item item)
        {
            try
            {
                this.item = item;
                await ValidateItem();
                if (errorList.Count == 0)
                {
                    item.TimeStamp = DateTime.UtcNow;
                    item.StatusId = (int)RecordStatusEnum.Active;
                    context.Item.Update(item);
                    await context.SaveChangesAsync();
                    return await GetItem(item.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Photo> InsertPhoto(Photo photo)
        {
            try
            {
                this.photo = photo;
                await ValidatePhoto();
                if (errorList.Count == 0)
                {
                    photo.Id = 0; //If not, cannot insert
                    context.Photo.Add(photo);
                    await context.SaveChangesAsync();
                    return await GetItemPhoto(photo.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Photo> UpdatePhoto(Photo photo)
        {
            try
            {
                this.photo = photo;
                await ValidatePhoto();
                if (errorList.Count == 0)
                {
                    item.TimeStamp = DateTime.UtcNow;
                    item.StatusId = (int)RecordStatusEnum.Active;
                    context.Photo.Update(photo);
                    await context.SaveChangesAsync();
                    return await GetItemPhoto(photo.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // Delete from db
        public async Task<bool> DeletePhotos(int itemId)
        {
            try
            {
                //cannoot validate
                //await ValidatePhoto();
                //if (errorList.Count == 0)
                //{
                    //context.Photo.RemoveRange(context.Photo.Where(x => x.ItemId == item.Id));
                    context.Photo.RemoveRange(context.Photo.Where(x => x.ItemId == itemId));
                    await context.SaveChangesAsync();
                    return true;
                //}
                //else
                //    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //Delete from File server
        public async Task DeletePhotoFiles(int itemId)
        {
            var photos = await GetItemPhotos(itemId);
            if(photos != null)
            {
                foreach (var photo in photos)
                {
                    await fileStorageService.DeleteFile(photo.FileName);
                }
            }
        }

        // 1. DeletePhotoFiles(): Delete photo from file at Azure
        // 2. DeletePhotos(): Delete photo from DB with itemId
        // 3. SaveFile(): Save photo(s) into only Azure file, 
        // 4. #3 will return it's saved file name list
        public async Task<List<string>> SavePhotos(IFormCollection photos, int itemId)
        {
            var itemPhotos = await GetItemPhotos(itemId);
            if (itemPhotos.Count > 0)
            {
                var itemPhotoId = itemPhotos.FirstOrDefault(c => c.ItemId == itemId).ItemId;
                await DeletePhotoFiles(itemId);
                await DeletePhotos(itemPhotoId);
            }

            Photo pt = new Photo();
            List<string> files = new List<string>();
            pt.ItemId = itemId;
            pt.IsDefault = true;           
            foreach (var photo in photos.Files)
            {
                var fileValidate = fileStorageService.CheckFile(photo);
                if (string.IsNullOrEmpty(fileValidate))
                {
                    var savedFileName = await fileStorageService.SaveFile(photo);
                    files.Add(savedFileName);
                    pt.FileName = savedFileName;
                    await InsertPhoto(pt);
                }
                else files.Add(fileValidate);
            }

            return files;
        }

        public async Task<Review> InsertReview(Review review)
        {
            try
            {
                this.review = review;
                await ValidateReviewItem();
                if (errorList.Count == 0)
                {
                    context.Review.Add(review);
                    await context.SaveChangesAsync();
                    return await GetReview(review.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<Review> UpdateReview(Review review)
        {
            try
            {
                this.review = review;
                await ValidateReview();
                if (errorList.Count == 0)
                {
                    DetachedKey(review);
                    context.Review.Update(review);
                    await context.SaveChangesAsync();
                    return await GetReview(review.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        void DetachedKey(Review review)
        {
            // to avoid 
            // "The instance of entity type cannot be tracked because another instance of this type with the same key is already being tracked"
            var local = context.Set<Review>()
                                       .Local
                                       .FirstOrDefault(entry => entry.Id.Equals(review.Id));
            if (local != null)
            {
                context.Entry(local).State = EntityState.Detached;
            }
            context.Entry(review).State = EntityState.Modified;
        }

        public async Task<bool> DeleteReview(int reviewId)
        {
            try
            {
                this.review = await GetReview(reviewId);
                if (review != null)
                {
                    context.Review.Remove(review);
                    await context.SaveChangesAsync();
                    return true;
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task ValidateItem()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == item.UserId);
            if (user == null) errorList.Add(4); // user not found

            var categoryType = await context.Category.FirstOrDefaultAsync(c => c.CategoryId == item.CategoryId);
            if (categoryType == null)  errorList.Add(13);   //Category Type not found

            var address = await context.Address.FirstOrDefaultAsync(c => c.Id == item.AddressId);
            if (address == null) errorList.Add(14); //Address not found
        }
        public async Task ValidatePhoto()
        {
            var item = await context.Item.FirstOrDefaultAsync(c => c.Id == photo.ItemId);
            if (item == null) errorList.Add(12); // Item not found
        }

        public async Task ValidateReview()
        {
            var review = await context.Review.FirstOrDefaultAsync(c => c.Id == this.review.Id);
            if (review == null) errorList.Add(19); // Review not found
        }
        public async Task ValidateReviewItem()
        {
            var item = await context.Review.FirstOrDefaultAsync(c => c.ItemId == review.ItemId);
            if (item == null) errorList.Add(12); // Item not found
        }
    }
}
