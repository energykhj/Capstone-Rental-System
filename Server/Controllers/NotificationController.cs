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

        [HttpGet("GetNotification")]
        public async Task<ActionResult<List<NotificationDTO>>> GetNotification(string userId, DateTime startDate)
        {
            List<NotificationDTO> dtoList = new List<NotificationDTO>();

            DateTime compareDate = new DateTime(startDate.Year, startDate.Month, startDate.Day);
            var notiList = await NB.GetNotification(userId, compareDate);
            foreach (var noti in notiList)
            {
                var fromUser = await UB.GetUserDetails(noti.FromUserId);
                var ToUser = await UB.GetUserDetails(noti.ToUserId);
                NotificationDTO dto = new NotificationDTO();
                dto = mapper.Map<NotificationDTO>(noti);
                dto.FromUserName = fromUser.FirstName + " " + fromUser.LastName;
                dto.ToUserName = ToUser.FirstName + " " + ToUser.LastName;

                dtoList.Add(dto);
            }

            return dtoList;
        }

        [HttpPost("InsertNotification")]
        public async Task<ActionResult<NotificationDTO>> InsertNotification(Notification dto)
        {
            return mapper.Map<NotificationDTO>(await NB.InsertNotification(dto));
        }

        [HttpPut("UpdateNotificationStatus")]
        public async Task<ActionResult<NotificationDTO>> UpdateNotificationStatus(int notiId)
        {
            return mapper.Map<NotificationDTO>(await NB.UpdateReadStatusToRead(notiId));
        }
    }


}
