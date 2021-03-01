
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public partial class UserBiz
    {
        private readonly PhoenixContext context;
        BlobServiceClient blobServiceClient;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };

        List<int> errorList = new List<int>();
        UserDetails userDetails = new UserDetails();
        Address address = new Address();

        public UserBiz(PhoenixContext _context)
        {
            this.context = _context;
        }
        
        public void SetUserDetailsDefaultValues()
        {
            userDetails.CreatedDate = DateTime.UtcNow;
            userDetails.TimeStamp = DateTime.UtcNow;
            userDetails.StatusId = (int)RecordStatusEnum.New;
        }

        public async Task<UserDetails> GetUserDetails(string UserId)
        {
            return await context.UserDetails.FirstOrDefaultAsync(c => c.Id == UserId);
        }
        public async Task<AspNetUsers> GetUserAccDetails(string UserId)
        {
            return await context.AspNetUsers
                .Where(c => c.Id == UserId)
                .Include(c => c.UserDetails)
                .FirstOrDefaultAsync(c => c.Id == UserId);
        }

        public async Task<AspNetUsers> GetUserAccount(string UserId)
        {
            return await context.AspNetUsers.FirstOrDefaultAsync(c => c.Id == UserId);
        }

        public void AddUserDetails()
        {
            context.UserDetails.Add(userDetails);
        }

        public void AddAddress()
        {
            context.Address.Add(address);
        }

        public async Task<UserDetails> InsertUserDetails(UserDetails userDetails)
        {
            try
            {
                this.userDetails = userDetails;
                await ValidateUser();
                if (errorList.Count == 0)
                {
                    SetUserDetailsDefaultValues();
                    AddUserDetails();
                    await context.SaveChangesAsync();
                    return await GetUserDetails(userDetails.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<UserDetails> UpdateUserDetails(UserDetails userDetails)
        {
            try
            {
                this.userDetails = userDetails;
                await ValidateUser();
                if (errorList.Count == 0)
                {
                    userDetails.TimeStamp = DateTime.Now;
                    userDetails.StatusId = (int)RecordStatusEnum.Active;
                    context.UserDetails.Update(userDetails);
                    await context.SaveChangesAsync();
                    return await GetUserDetails(userDetails.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        #region Insert Avatar - old
        /*public async Task<string> InsertAvatar(IFormFile file, string id)
        {
            try
            {
                if (file == null) errorList.Add(8); // file not found
                if (file.Length == 0) errorList.Add(9); // file empty
                if (file.Length > 10 * 1024 * 1024) errorList.Add(10);// "Max file size exceeded.Max, 10Mbyte";
                if (!ACCEPTED_FILE_TYPES.Any(s => s == Path.GetExtension(file.FileName).ToLower())) errorList.Add(11);// "Invalid file type.";

                if (errorList.Count == 0)
                {
                    // Local Storage
                    //var uploadFilesPath = "Resources" + Path.AltDirectorySeparatorChar + "avatar" +
                    //                            Path.AltDirectorySeparatorChar + id;
                    //if (!Directory.Exists(uploadFilesPath))
                    //    Directory.CreateDirectory(uploadFilesPath);
                    //else
                    //{
                    //    DirectoryInfo di = new DirectoryInfo(uploadFilesPath);
                    //    foreach (FileInfo exfile in di.GetFiles())
                    //    {
                    //        exfile.Delete();
                    //    }
                    //}
                    //var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                    //var filePath = Path.Combine(uploadFilesPath, fileName);
                    //var filePath1 = uploadFilesPath + Path.AltDirectorySeparatorChar + fileName;
                    //using (var stream = new FileStream(filePath, FileMode.Create))
                    //{
                    //    await file.CopyToAsync(stream);
                    //}
                    //return filePath;

                    // Azure Upload
                    string filename = file.FileName;

                    BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("photos");
                    BlobClient blobClient = containerClient.GetBlobClient(filename);
                    await blobClient.UploadAsync(file.OpenReadStream(), true);

                    return filename;
                }

                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Stream> GetAvatar(string id)
        {
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("photos");
            Stream stream = null;

            if (await containerClient.ExistsAsync())
            {
                BlobClient blobClient = containerClient.GetBlobClient(id);

                if (await blobClient.ExistsAsync())
                {
                    stream = new MemoryStream();
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    await download.Content.CopyToAsync(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                }
            }

            return stream; // returns a FileStreamResult
        }*/
        #endregion

        public string GetUserAvatar(string userId)
        {
            return context.UserDetails.Where(x => x.Id == userId)
                                       .Select(x => x.PhotoUrl)
                                       .SingleOrDefault();
        }

        public async Task<Address> InsertAddress(Address address)
        {
            try
            {
                this.address = address;
                await ValidateAddress();
                if (errorList.Count == 0)
                {
                    AddAddress();
                    await context.SaveChangesAsync();
                    return await GetAddress(address.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<Address> UpdateAddress(Address address)
        {
            try
            {
                this.address = address;
                await ValidateAddress();
                if (errorList.Count == 0)
                {
                    context.Address.Update(address);
                    await context.SaveChangesAsync();
                    return await GetAddress(address.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Address> GetAddress(int Id)
        {
            return await context.Address
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<List<Address>> GetAddresses(string UserId)
        {
            return await context.Address
                 .Where(c => c.UserId == UserId)
                 .ToListAsync();
        }

        public async Task<Address> GetDefaultAddress(string UserId)
        {
            return await context.Address
                 .Where(c => c.IsDefault == true)
                 .FirstOrDefaultAsync(c => c.UserId == UserId);
        }

        public async Task ValidateUser()
        {
            var user = await context.AspNetUsers.FirstOrDefaultAsync(c => c.Id == userDetails.Id);
            if (user == null) errorList.Add(4); // user not found
            //else errorList.Add(5);
        }
       
        public async Task ValidateAddress()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == address.UserId);
            if (user == null) 
                errorList.Add(4);   //user not found
        }
        public async Task ValidateUpdateAddress()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == address.UserId);
            if (user == null)
                errorList.Add(4);   //user not found
            var add = await context.Address.FirstOrDefaultAsync(c => c.Id == address.Id);
            if (add == null)
                errorList.Add(14);  //Address not found
        }
    }
}
