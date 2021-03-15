using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DTO
{
    public class NotificationDTO
    {
        public int Id { get; set; }
        public string FromUserId { get; set; }
        public string FromUserName { get; set; }
        public string ToUserId { get; set; }
        public string ToUserName { get; set; }
        public int? ItemId { get; set; }
        public int? NotiType { get; set; }
        public string Type { get; set; }
        public string Message { get; set; }
        public DateTime? SendDate { get; set; }
        public bool? IsRead { get; set; }
    }
}
