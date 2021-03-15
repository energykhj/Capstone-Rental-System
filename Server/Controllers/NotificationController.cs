using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly NotificationBiz NB;
        private readonly UserBiz UB;

        public NotificationController(PhoenixContext _context, IMapper _mapper)
        {
            this.context = _context;
            this.mapper = _mapper;
            NB = new NotificationBiz(context);
            UB = new UserBiz(context);
        }

        [HttpGet("GetTransactionByUser")]
        public async Task<ActionResult<List<NotificationDTO>>> GetNotification(string userId, DateTime startDate)
        {         
            var noti = mapper.Map<List<NotificationDTO>>(await NB.GetNotification(userId/*, startDate*/));
            return noti;
        }

        [HttpPost("InsertNotification")]
        public async Task<ActionResult<List<NotificationDTO>>> InsertNotification(NotificationDTO dto)
        {

            var noti = mapper.Map<List<NotificationDTO>>(await NB.GetNotification("dd"));
            return noti;
        }

        [HttpPut("UpdateNotificationStatus")]
        public async Task<ActionResult<List<NotificationDTO>>> UpdateNotificationStatus(int notiId)
        {

            var noti = mapper.Map<List<NotificationDTO>>(await NB.GetNotification("dd"));
            return noti;
        }
    }


}
