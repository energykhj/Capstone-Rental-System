
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace Shared.Helpers
{
    public interface IFileStorageService
    {        
        Task<string> EditFile(IFormFile content, string fileRoute);
        Task DeleteFile(string fileRoute);
        //string CheckFile(IFormCollection content);
        string CheckFile(IFormFile content);
        Task<string> SaveFile(IFormFile content);
        Task<Stream> GetFile(string fileName);
    }
}
