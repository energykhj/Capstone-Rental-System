using Microsoft.EntityFrameworkCore;
using Server.Models;
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

        public async Task<List<Notification>> GetNotification(string userId)
        {
            return await context.Notification
                .Where((c => c.FromUserId == userId || 
                        c.ToUserId == userId) )
                .ToListAsync();
        }
    }
}
