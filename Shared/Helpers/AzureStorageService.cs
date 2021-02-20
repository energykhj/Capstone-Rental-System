using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using System.IO;
using Microsoft.AspNetCore.Http;
using Azure.Storage.Blobs.Models;

namespace Shared.Helpers
{
    public class AzureStorageService : IFileStorageService
    {
        private readonly BlobContainerClient blobContainer;

        public AzureStorageService(BlobServiceClient _blobServiceClient)
        {
            blobContainer = _blobServiceClient.GetBlobContainerClient("photos");
        }

        public async Task DeleteFile(string fileRoute)
        {
            var blobClient = blobContainer.GetBlobClient(fileRoute);
            await blobClient.DeleteIfExistsAsync();
        }

        public async Task<string> EditFile(IFormFile fileContent, string filePath)
        {
            if (!string.IsNullOrEmpty(filePath))
            {
                await DeleteFile(filePath);
            }

            return await SaveFile(fileContent);
        }

        public async Task<string> SaveFile(IFormFile fileContent)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(fileContent.FileName);

            var blobClient = blobContainer.GetBlobClient(fileName);
            await blobClient.UploadAsync(fileContent.OpenReadStream(), true);

            return fileName;
        }


        public async Task<Stream> GetFile(string fileName)
        {
            Stream stream = null;

            if (await blobContainer.ExistsAsync())
            {
                var blobClient = blobContainer.GetBlobClient(fileName);

                if (await blobClient.ExistsAsync())
                {
                    stream = new MemoryStream();
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    await download.Content.CopyToAsync(stream);
                    stream.Seek(0, SeekOrigin.Begin);
                }
            }
            
            return stream; // returns a FileStreamResult
        }


        public static async Task<byte[]> GetBytes(IFormFile formFile)
        {
            using (var memoryStream = new MemoryStream())
            {
                await formFile.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }
    }
}
