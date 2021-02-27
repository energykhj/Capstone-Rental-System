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
        List<int> errorList = new List<int>();

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
                .Include(c => c.Category)
                .Include(c => c.RecordStatus)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Item> GetItem(string userId)
        {
            return await context.Item
                .Include(c => c.Category)
                .Include(c => c.RecordStatus)
                .FirstOrDefaultAsync(c => c.UserId == userId);
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
                .ToListAsync();
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
                    item.TimeStamp = DateTime.Now;
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
                    item.TimeStamp = DateTime.Now;
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
        public async Task<Item> DeletePhotos(int itemId)
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
                    return await GetItem(item.Id);
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

        public async Task ValidatePhoto(int itemID)
        {
            var item = await context.Item.FirstOrDefaultAsync(c => c.Id == itemID);
            if (item == null) errorList.Add(12); // Item not found
        }

    }
}
