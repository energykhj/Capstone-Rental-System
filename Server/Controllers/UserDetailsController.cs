using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDetailsController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        //private readonly IFileStorageService fileStorageService;
        public UserDetailsController(PhoenixContext _context, IMapper _mapper)
        {
            this.context = _context;
            this.mapper = _mapper;
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<UserDetailsDTO>> GetUser(string id)
        {
            var userDetail = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == id);
            return mapper.Map<UserDetailsDTO>(userDetail);
        } 
                
        [HttpPost]  
        public async Task<ActionResult<UserDetailsDTO>> Post(UserDetailsDTO userDetailsDTO)
        {
            try
            {
                var userDetails = mapper.Map<UserDetails>(userDetailsDTO);

                userDetails.CreateDate = DateTime.UtcNow;
                userDetails.TimeStamp = DateTime.UtcNow;
                userDetails.StatusId = (int)UserStatusEnum.New;

                var validation = ValidatePost(userDetails);

                if (validation == null)
                {
                    context.Add(userDetails);
                    await context.SaveChangesAsync();
                    return Ok(mapper.Map<UserDetailsDTO>(userDetails));
                }
                else
                {
                    return BadRequest(validation);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorManager(ex.GetBaseException()));
            }
        }

        [HttpPut]
        public async Task<ActionResult<UserDetailsDTO>> Put(UserDetailsDTO userDetailsDTO)
        {
            try
            {
                var validation = ValidatePut(userDetailsDTO);

                if (validation == null)
                {
                    var userDetails = await context.UserDetails.FirstOrDefaultAsync(c => c.Id == userDetailsDTO.Id);

                    userDetails.FirstName = userDetailsDTO.FirstName;
                    userDetails.LastName = userDetailsDTO.LastName;
                    userDetails.Phone = userDetailsDTO.Phone;
                    userDetails.ProvinceId = userDetailsDTO.ProvinceId;
                    userDetails.TimeStamp = DateTime.UtcNow;

                    userDetails.StatusId = userDetails.StatusId == (int)UserStatusEnum.New ?
                                         (int)UserStatusEnum.Active :
                                         userDetails.StatusId;

                    if (userDetailsDTO.PhotoUrl != null)
                    {
                       // delete already uploaded image file then, save again
                    }

                    context.Update(userDetails);
                    await context.SaveChangesAsync();
                    return Ok(mapper.Map<UserDetailsDTO>(userDetails));
                }
                else
                {
                    return BadRequest(validation);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new ErrorManager(ex.GetBaseException()));
            }
        }

        public List<ErrorManager> ValidatePost(UserDetails userDetails)
        {
            List<ErrorManager> errors = new List<ErrorManager>();

            if (context
                .UserDetails
                .FirstOrDefault(c => c.Id == userDetails.Id) != null)
                errors.Add(new ErrorManager(6));

            return errors.Count > 0 ? errors : null;
        }

        public List<ErrorManager> ValidatePut(UserDetailsDTO userDetails)
        {
            List<ErrorManager> errors = new List<ErrorManager>();
            PhoenixContext additionalContext = new PhoenixContext();

            if (additionalContext
                .AspNetUsers
                .FirstOrDefault(c => c.Id == userDetails.Id) == null)
                errors.Add(new ErrorManager(4));

            if (additionalContext
                .UserDetails
                .FirstOrDefault(c => c.Id == userDetails.Id) == null)
                errors.Add(new ErrorManager(6));

            if (additionalContext
                .Province
                .FirstOrDefault(c => c.Id == userDetails.ProvinceId) == null)
                errors.Add(new ErrorManager(9));

            additionalContext.Dispose();

            return errors.Count > 0 ? errors : null;
        }
    }
}
