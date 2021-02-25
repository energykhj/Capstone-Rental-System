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
                return await BuildToken(model);
                //var c = await CreateUserDetails(userDetails);
            }
            else
            {
                return BadRequest(result.Errors.ToList()[0].Code);
            }
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
        [HttpPost("changepassword")]
        
        public async Task<ActionResult> ChangePassword(UserInfo userInfo)
        {
            var user = await userManager.FindByEmailAsync(userInfo.Email);
            var trychange = await userManager.ChangePasswordAsync(user,
                                                                  userInfo.Password,
                                                                  userInfo.NewPassword);

            if (trychange.Succeeded)
                return Ok();
            else
                return BadRequest();
        }
    }
}
