﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.BizLogic;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly ItemBiz IB;
        private readonly TransactionBiz TB;
        private readonly UserBiz UB;

        public TransactionController(PhoenixContext _context, IMapper _mapper)
        {
            this.context = _context;
            this.mapper = _mapper;
            IB = new ItemBiz(context);
            TB = new TransactionBiz(context);
            UB = new UserBiz(context);
        }

        [HttpGet("GetTransactionByUser")]




        public async Task<ActionResult<List<TransactionItemPkgDTO>>> GetTransactionByUser([FromQuery] string userId, [FromQuery] string statusIds)
        {
            List<TransactionItemPkgDTO> dtoPkgList = new List<TransactionItemPkgDTO>();
            List<int> statusList = GetStatusList(statusIds);

            foreach (var status in statusList)
            {
                var Transactions = mapper.Map<List<TransactionDTO>>(await TB.GetTransactionByBorrower(userId, status));
                foreach (var trans in Transactions)
                {
                    var Item = await IB.GetItem(trans.ItemId);
                    var Photo = await IB.GetItemDefaultPhoto(Item.Id);
                    var statusName = await TB.GetTransactionStatusName((int)trans.CurrentStatus);

                    TransactionItemPkgDTO dto = new TransactionItemPkgDTO()
                    {
                        Trans = mapper.Map<TransactionDTO>(trans),
                        Item = mapper.Map<ItemDTO>(Item),
                    };
                    dto.Trans.StatusName = statusName;
                    dto.Item.DefaultImageFile = (Photo == null) ? null : Photo.FileName;

                    dtoPkgList.Add(dto);
                }
            }
            
            return dtoPkgList;
        }


        [HttpGet]
        public async Task<ActionResult<List<TransactionItemPkgDTO>>> GetItemByStatus([FromQuery] string userId, [FromQuery] string statusIds)
        {
            List<TransactionItemPkgDTO> dtoPkgList = new List<TransactionItemPkgDTO>();
            List<int> statusList = GetStatusList(statusIds);
            var Items = mapper.Map<List<ItemDTO>>(await IB.GetItem(userId));            

            foreach (var item in Items)
            {
                foreach (var status in statusList)
                {
                    var trans = await TB.GetItemByStatus(item.Id, status);
                    if (trans != null)
                    {
                        var Photo = await IB.GetItemDefaultPhoto(item.Id);
                        var statusName = await TB.GetTransactionStatusName((int)trans.CurrentStatus);
                        var user = await UB.GetUserDetails(trans.BorrowerId);
                        
                        var td = trans.TransactionDetail.Where(c => c.TransactionId == trans.Id).FirstOrDefault();

                        TransactionItemPkgDTO dto = new TransactionItemPkgDTO()
                        {
                            Item = mapper.Map<ItemDTO>(item),
                            Trans = mapper.Map<TransactionDTO>(trans),
                        };
                        dto.Trans.StatusName = statusName;
                        dto.Trans.BorrowerName = user.FirstName + " " + user.LastName;
                        dto.Trans.requestDate = td.Date;
                        dto.Item.DefaultImageFile = (Photo == null) ? null : Photo.FileName;

                        dtoPkgList.Add(dto);
                    }
                }
                
            }
            return dtoPkgList;
        }

        [HttpPost]
        public async Task<ActionResult> InsertTransaction([FromBody] TransactionPkgDTO dto)
        {
            /*
             * double check - date, first check in Client.
             * The start date of Borrow can not be greater than start date of Item
             */
            var Trans = mapper.Map<Transaction>(dto.Trans);
            var TransDetails = mapper.Map<TransactionDetail>(dto.TranDetails);

            try
            {
                var TH = await TB.InsertTransaction(Trans);
                if (TH.Id > 0)
                {
                    TransDetails.TransactionId = TH.Id;
                    var TDS = await TB.InsertTransactionDetail(TransDetails);

                    if (TDS.Id > 0) return Ok(TH.Id);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            return BadRequest();
        }

        /*
         * when status either 'request' or 'rejected', can only be updated
         * 'Confirmed' means that the date has been fixed so, can't be updated.
         * Transaction Detail can't be updated. -- add transaction detail? for header update??
         */
        [HttpPut("UpdateTransaction")]
        public async Task<ActionResult<TransactionDTO>> UpdateTransaction([FromBody] TransactionDTO trans)
        {
            var oldTrans = await TB.GetTransaction(trans.Id);
            var newTrans = mapper.Map<Transaction>(trans);
            var curStatus = TB.GetTransactionStatusName((int)oldTrans.CurrentStatus);

            if (oldTrans.CurrentStatus == (int)TransactionStatusEnum.Request ||
                oldTrans.CurrentStatus == (int)TransactionStatusEnum.Rejected)
            {
                try
                {
                    // keep exist status, status can't edited when update
                    newTrans.CurrentStatus = oldTrans.CurrentStatus;
                    return Ok(mapper.Map<TransactionDTO>(await TB.UpdateTransaction(newTrans)));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else return BadRequest($"Current status is {curStatus}, can't be updated");
        }

        [HttpPut("InsertTransactionDetails")]
        public async Task<ActionResult<TransactionStatusDTO>> InsertTransactionDetails([FromBody] TransactionDetailsDTO td)
        {
            var curTrans = await TB.GetTransaction(td.TransactionId);
            var transDetails = mapper.Map<TransactionDetail>(td);
            var curStatus = TB.GetTransactionStatusName((int)curTrans.CurrentStatus);
            var nextStatus = TB.GetTransactionStatusName(transDetails.StatusId);
           
            if (CanNextStatus((int)curTrans.CurrentStatus, transDetails.StatusId))
            {
                try
                {
                    curTrans.CurrentStatus = transDetails.StatusId;
                    var updatedTH = await UpdateStatus(curTrans);
                    return Ok(mapper.Map<TransactionStatusDTO>(await TB.InsertTransactionDetail(transDetails)));
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            else return BadRequest($"Current status is {curStatus}, can't be added or updateed to {nextStatus}");
        }
        private async Task<string> UpdateStatus(Transaction trans)
        {
            var newTH = await TB.UpdateTransaction(trans);
            return await TB.GetTransactionStatusName((int)newTH.CurrentStatus);
        }
        private bool CanNextStatus(int curStatus, int nextStatus)
        {
            /* Request = 1,
                Confirmed = 2,
                Rejected = 3, 
                CanceledByLender = 4,
                CanceledByBorrower = 5,
                RequestReturn = 6,
                ReturnComplete = 7
            
                1 => 2, 3, 4, 5 가능
                2 => 4, 5, 6 가능
                3 => 2 가능
                4 => 없음
                5 => 없음
                6 => 7

                1차적으로 Clent에서 체크되어야함. - 서버 왔다갔다 하면 속도가...
           */

            if (curStatus == (int)TransactionStatusEnum.CanceledByLender ||
               curStatus == (int)TransactionStatusEnum.CanceledByBorrower)
               return false;

            switch (curStatus)
            {
                case (int)TransactionStatusEnum.Request:
                    if (nextStatus == (int)TransactionStatusEnum.Confirmed ||
                        nextStatus == (int)TransactionStatusEnum.Rejected ||
                        nextStatus == (int)TransactionStatusEnum.CanceledByLender ||
                        nextStatus == (int)TransactionStatusEnum.CanceledByBorrower)
                        return true;
                    break;
                case (int)TransactionStatusEnum.Confirmed:
                    if (nextStatus == (int)TransactionStatusEnum.CanceledByLender ||
                        nextStatus == (int)TransactionStatusEnum.CanceledByBorrower ||
                        nextStatus == (int)TransactionStatusEnum.RequestReturn)
                        return true;
                    break;
                case (int)TransactionStatusEnum.Rejected:
                    if (nextStatus == (int)TransactionStatusEnum.Confirmed)
                        return true;
                    break;
                case (int)TransactionStatusEnum.RequestReturn:
                    if (nextStatus == (int)TransactionStatusEnum.ReturnComplete)
                        return true;
                    break;
                default:
                    break;
            }

            return false;
        }

        private List<int> GetStatusList(string statusIds)
        {
            string[] statusIdList = statusIds.Split(",");
            List<int> statusList = new List<int>();
            int result;
            foreach (var statusId in statusIdList)
            {
                if (int.TryParse(statusId, out result))
                {
                    statusList.Add(result);
                }
            }

            return statusList;
        }

    }
}
