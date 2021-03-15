using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.BizLogic
{
    public partial class NotificationBiz
    {
        private readonly PhoenixContext context;

        List<int> errorList = new List<int>();
        Notification notification = new Notification();

        public NotificationBiz(PhoenixContext _context)
        {
            this.context = _context;
        }

        public async Task<Notification> GetNotification(int Id)
        {
            return await context.Notification
                .Include(c => c.Item)
                .Include(c => c.NotiTypeNavigation)
                .FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<List<Notification>> GetNotification(string userId, DateTime dt)
        {           
            return await context
                            .Notification
                            .Include(c => c.Item)
                            .Include(c => c.NotiTypeNavigation)
                            .Where(c => c.SendDate > dt && 
                                    (c.FromUserId == userId || c.ToUserId == userId))
                            .ToListAsync();
        }

        public async Task<Notification> InsertNotification(Notification noti)
        {
            try
            {
                this.notification = noti;
                await ValidateNoti();
                if (errorList.Count == 0)
                {
                    context.Notification.Add(notification);
                    await context.SaveChangesAsync();
                    return await GetNotification(notification.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Notification> UpdateReadStatusToRead(int notiId)
        {
            try
            {
                this.notification = await GetNotification(notiId);
                await ValidateNoti();
                if (errorList.Count == 0)
                {
                    notification.IsRead = true;
                    context.Notification.Update(notification);
                    await context.SaveChangesAsync();
                    return await GetNotification(notification.Id);
                }
                else
                    throw new Exception(new ErrorManager().ErrorList(errorList));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task ValidateNoti()
        {
            var user = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == notification.FromUserId && c.Id == notification.ToUserId);
            if (user == null) errorList.Add(4); // user not found

            var notiType = await context.NotificationType.FirstOrDefaultAsync(c => c.Id == notification.NotiType);
            if (notiType == null) errorList.Add(17);   //Notification type not found

            var item = await context.Item.FirstOrDefaultAsync(c => c.Id == notification.ItemId);
            if (item == null) errorList.Add(12); //Item not found
        }
    }
}
