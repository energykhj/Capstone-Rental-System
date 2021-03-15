
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shared.Helpers
{
    public class ErrorManager
    {
        public int Code { get; set; }
        public string Message { get; set; }
        public string StackTrace { get; set; }

        private Dictionary<int, string> codeList = new Dictionary<int, string>()
        {
            {-1, "General error"},
            {0, "Success - No Errors!"},
            {1, "The email is already taken"},
            {2, "RoleId is Invalid"},
            {3, "User or password not found" },
            {4, "User not found" },
            {5, "User already got details" },
            {6, "User Detail not found" },
            {7, "User Status not found" },
            {8, "Image file is not found" },
            {9, "Image file is empty" },
            {10, "Max file size exceeded.(max, 10Mbyte)" },
            {11, "Invalid file type." },
            {12, "Item not found" },
            {13, "Category Type not found" },
            {14, "Address not found" },
            {15, "Related transaction not found" },
            {16, "Status not found" },
            {17, "Notification type not found" },
        };

        public ErrorManager()
        {
        }

        public ErrorManager(int code)
        {
            SetError(code);
        }

        public ErrorManager(Exception ex)
        {
            Code = 0;
            Message = "Internal Error: " + ex.Message;
            StackTrace = ex.StackTrace;
        }

        public void SetError(int code)
        {
            var currentMessage = codeList.FirstOrDefault(c => c.Key == code);
            Code = currentMessage.Key;
            Message = currentMessage.Value;
            StackTrace = "N/A";
        }

        public string ErrorList(List<int> errors)
        {
            string result = string.Empty;
            foreach (var error in errors)
            {
                result += JsonConvert.SerializeObject(new ErrorManager(error));
            }
            return result;
        }
    }
}
