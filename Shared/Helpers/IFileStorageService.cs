
using System.IO;
using System.Threading.Tasks;

namespace Shared.Helpers
{
    public interface IFileStorageService
    {
        Task<string> EditFile(FileInfo file, string extension, string fileRoute);
        Task DeleteFile(string fileRoute);
        Task<string> SaveFile(FileInfo file, string extension);
    }
}
