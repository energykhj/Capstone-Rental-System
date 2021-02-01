using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Shared.DTO;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using Server.Models;
using Shared.Helpers;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        //private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper mapper;

        public object JwtRegisterdClaimNames { get; private set; }
        public AuthenticationController(UserManager<IdentityUser> userManager,
                                        SignInManager<IdentityUser> signInManager,
                                        IConfiguration configuration)
        {
            this.userManager = userManager;
            //this.roleManager = roleManager;
            this.signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<ActionResult<UserToken>> CreateUser([FromBody] UserInfo model)
        {
            IdentityUser user = new IdentityUser { UserName = model.Email, Email = model.Email };
            var result = await userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                UserDetails userDetails = new UserDetails()
                {
                    Id = user.Id,
                    CreateDate = DateTime.UtcNow,
                    TimeStamp = DateTime.UtcNow,
                    StatusId = (int)UserStatusEnum.New
            };

                var c = await CreateUserDetails(userDetails);
                return await BuildToken(model);
            }
            else
            {
                return BadRequest("Username or password invalid");
            }
        }

        [HttpGet("GetUser/{id}")]
        public ActionResult<UserDetails> GetUser(string id)
        {
            PhoenixContext context = new PhoenixContext();
            var userDetail = context.UserDetails.FirstOrDefault(c => c.Id == id);
            //var ttt = mapper.Map<UserDetailsDTO>(userDetail);
            return Ok(userDetail);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserToken>> Login([FromBody] UserInfo userInfo)
        {
            try
            {
                var result = await signInManager.PasswordSignInAsync(userInfo.Email,
                    userInfo.Password, isPersistent: false, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    return await BuildToken(userInfo);
                }
                else
                {
                    return BadRequest("Invalid login attempt");
                }
            }
            catch (Exception ex)
            {
                throw ex.GetBaseException();
            }
        }

        private async Task<UserToken> BuildToken(UserInfo userinfo)
        {
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, userinfo.Email),
                new Claim(ClaimTypes.Email, userinfo.Email),
                new Claim("myvalue", "whatever I want")
            };

            var identityUser = await userManager.FindByEmailAsync(userinfo.Email);
            var claimsDB = await userManager.GetClaimsAsync(identityUser);

            claims.AddRange(claimsDB);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //var expiration = DateTime.UtcNow.AddMinutes(300);

            var expiration = DateTime.UtcNow.AddYears(1);
            JwtSecurityToken token = new JwtSecurityToken(
               issuer: null,
               audience: null,
               claims: claims,
               expires: expiration,
               signingCredentials: creds);

            return new UserToken()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expiration,
                UserId = identityUser.Id
            };
        }

        private async Task<ActionResult> CreateUserDetails(UserDetails userDetails)
        {
            try
            {
                var validation = ValidateUser(userDetails);

                if (validation == null)
                {
                    PhoenixContext context = new PhoenixContext();
                    context.Add(userDetails);
                    await context.SaveChangesAsync();
                    return Ok(true);
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

        private async Task<ActionResult> CreateUserDetailsXXX(UserDetailsDTO userDetailsDTO)
        {
            try
            {
                var userDetails = mapper.Map<UserDetails>(userDetailsDTO);

                userDetails.CreateDate = DateTime.UtcNow;
                userDetails.TimeStamp = DateTime.UtcNow;
                userDetails.StatusId = (int)UserStatusEnum.New;

                var validation = ValidateUser(userDetails);

                if (validation == null)
                {
                    PhoenixContext context = new PhoenixContext();
                    context.Add(userDetails);
                    await context.SaveChangesAsync();
                    return Ok(true);
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

        public List<ErrorManager> ValidateUser(UserDetails userDetails)
        {
            List<ErrorManager> errors = new List<ErrorManager>();
            PhoenixContext context = new PhoenixContext();
            if (context
                .UserDetails
                .FirstOrDefault(c => c.Id == userDetails.Id) != null)
                errors.Add(new ErrorManager(6));

            return errors.Count > 0 ? errors : null;
        }

    }
}
