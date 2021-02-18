using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Server.BizLogic
{
    public partial class ItemBiz
    {
        private readonly PhoenixContext context;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };

        Item item = new Item();
        Photo photo = new Photo();
        List<int> errorList = new List<int>();

        public ItemBiz(PhoenixContext _context)
        {
            this.context = _context;
        }

        public void SetUserDetailsDefaultValues()
        {
            item.CreatedDate = DateTime.UtcNow;
            item.TimeStamp = DateTime.UtcNow;
            item.StatusId = (int)RecordStatusEnum.New;
        }

        public async Task<Item> GetItem(int Id)
        {
            return await context.Item.FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Item> GetItem(string userId)
        {
            return await context.Item.FirstOrDefaultAsync(c => c.UserId == userId);
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

        public async Task<List<Item>> GetSearchItem(string strSearch)
        {
            return await context.Item
                .Where(c => Regex.IsMatch(c.Name.ToUpper(), $".*{strSearch}.*"))
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

        public async Task<Photo> InsertPhoto(Photo Photo)
        {
            try
            {
                this.photo = Photo;
                await ValidatePhoto();
                if (errorList.Count == 0)
                {
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
        public async Task<Item> DeletePhotos(Item item)
        {
            try
            {
                this.item = item;
                await ValidateItem();
                if (errorList.Count == 0)
                {
                    context.Photo.RemoveRange(context.Photo.Where(x => x.ItemId == item.Id));
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

        public async Task<List<Photo>> SavePhotos(IFormFileCollection Photos)
        {
            try
            {
                Photo photo;
                List<Photo> photos = new List<Photo>();

                var uploadFilesPath = "Resources" + Path.AltDirectorySeparatorChar + "item" + Path.AltDirectorySeparatorChar + item.Id;
                if (!Directory.Exists(uploadFilesPath))
                    Directory.CreateDirectory(uploadFilesPath);

                // delete all exist uploaded imem files
                else 
                {
                    DirectoryInfo di = new DirectoryInfo(uploadFilesPath);
                    foreach (FileInfo exFile in di.GetFiles())
                    {
                        exFile.Delete();
                    }
                }

                foreach (var file in Photos)
                {
                    if (file == null) errorList.Add(8); // file not found
                    if (file.Length == 0) errorList.Add(9); // file empty
                    if (file.Length > 10 * 1024 * 1024) errorList.Add(10);// "Max file size exceeded.Max, 10Mbyte";
                    if (!ACCEPTED_FILE_TYPES.Any(s => s == Path.GetExtension(file.FileName).ToLower())) errorList.Add(11);// "Invalid file type.";

                    if (errorList.Count == 0)
                    {
                        photo = new Photo();

                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(uploadFilesPath, fileName);
                        var filePath1 = uploadFilesPath + Path.AltDirectorySeparatorChar + fileName;
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        photo.ItemId = item.Id;
                        photo.FileName = filePath;
                        photos.Add(photo);
                    }
                    else
                        throw new Exception(new ErrorManager().ErrorList(errorList));
                }
                    
                return photos;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<string> SavePhoto(IFormFile file)
        {
            try
            {
                if (file == null) errorList.Add(8); // file not found
                if (file.Length == 0) errorList.Add(9); // file empty
                if (file.Length > 10 * 1024 * 1024) errorList.Add(10);// "Max file size exceeded.Max, 10Mbyte";
                if (!ACCEPTED_FILE_TYPES.Any(s => s == Path.GetExtension(file.FileName).ToLower())) errorList.Add(11);// "Invalid file type.";

                if (errorList.Count == 0)
                {
                    var uploadFilesPath = "Resources" + Path.AltDirectorySeparatorChar + "item" + Path.AltDirectorySeparatorChar + item.Id;
                    if (!Directory.Exists(uploadFilesPath))
                        Directory.CreateDirectory(uploadFilesPath);

                    // delete all exist uploaded imem files
                    else
                    {
                        DirectoryInfo di = new DirectoryInfo(uploadFilesPath);
                        foreach (FileInfo exFile in di.GetFiles())
                        {
                            exFile.Delete();
                        }
                    }
                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadFilesPath, fileName);
                    var filePath1 = uploadFilesPath + Path.AltDirectorySeparatorChar + fileName;
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    return filePath;
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

    }
}
