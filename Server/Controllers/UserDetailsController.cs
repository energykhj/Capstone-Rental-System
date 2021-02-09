using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;
using Shared.DTO;
using Shared.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDetailsController : ControllerBase
    {
        private readonly PhoenixContext context;
        private readonly IMapper mapper;
        private readonly string[] ACCEPTED_FILE_TYPES = new[] { ".jpg", ".jpeg", ".png" };
        //private readonly StorageService fileStorageService;
        public UserDetailsController(PhoenixContext _context, IMapper _mapper)
        {
            //this.fileStorageService = _fileStorageServic;
            this.context = _context;
            this.mapper = _mapper;
        }

        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<UserDetailsDTO>> GetUser(string id)
        {
            var userDetail = await context
               .UserDetails
               .Include(c => c.IdNavigation)
               .FirstOrDefaultAsync(c => c.Id == id);
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

        [HttpPut("UpdateUser")]
        public async Task<ActionResult<UserDetailsDTO>> UpdateUser([FromBody] UserDetailsDTO userDetailsDTO)
        //public async Task<ActionResult<UserDetailsDTO>> Put(UserDetailsDTO userDetailsDTO)
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
                    userDetails.Address1 = userDetailsDTO.Address1;
                    userDetails.Address2 = userDetailsDTO.Address2;
                    userDetails.City = userDetailsDTO.Phone;
                    userDetails.ProvinceId = userDetailsDTO.ProvinceId;
                    userDetails.PostalCode = userDetailsDTO.PostalCode;
                    userDetails.PhotoUrl = userDetailsDTO.PhotoUrl;
                    userDetails.TimeStamp = DateTime.UtcNow;

                    userDetails.StatusId = userDetails.StatusId == (int)UserStatusEnum.New ?
                                         (int)UserStatusEnum.Active :
                                         userDetails.StatusId;                  

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

        [HttpPost("SavePhoto")]
        public async Task<IActionResult> SavePhoto()
        {            
            try
            {

                var file = Request.Form.Files[0];

                if (file == null) return BadRequest("Null File");
                if (file.Length == 0) return BadRequest("Empty" +
                    " File");

                if (file.Length > 10 * 1024 * 1024) return BadRequest("Max file size exceeded.");
                if (!ACCEPTED_FILE_TYPES.Any(s => s == Path.GetExtension(file.FileName).ToLower())) return BadRequest("Invalid file type.");
                var uploadFilesPath = "Resources" + Path.AltDirectorySeparatorChar + "avatar";
                var uploadFilesPath1 = Path.Combine("Resources","avatar");
                if (!Directory.Exists(uploadFilesPath))
                    Directory.CreateDirectory(uploadFilesPath);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadFilesPath, fileName);
                var filePath1 = uploadFilesPath + Path.AltDirectorySeparatorChar + fileName;
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return Ok(new { filePath });

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpPost("SavePhoto/{id}")]
        public async Task<IActionResult> SavePhoto1()
        {
            try
            {
                var formCollection = await Request.ReadFormAsync();
                var file = formCollection.Files.First();

                var postedFile = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Avatar");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (postedFile.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(postedFile.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        postedFile.CopyTo(stream);
                    }
                    return Ok(new { dbPath });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
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

            /*if (additionalContext
                .Province
                .FirstOrDefault(c => c.Id == userDetails.ProvinceId) == null)
                errors.Add(new ErrorManager(9));*/

            additionalContext.Dispose();

            return errors.Count > 0 ? errors : null;
        }
    }
}
