using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<User> _userManager;

        public AdminController(DataContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("userWithRoles")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<IActionResult> GetUserWithRoles()
        {
            var userWithRoles = await _context.Users
            .OrderBy(u => u.UserName)
            .Select(user => new
            {
                Id = user.Id,
                Username = user.UserName,
                Roles = (from userRole in user.UserRoles
                         join role in _context.Roles
                         on userRole.RoleId
                         equals role.Id
                         select role.Name).ToList()
            }).ToListAsync();
            return Ok(userWithRoles);
        }

        [HttpGet("photosForModeration")]
        [Authorize(Policy = "RequirePhotoModerator")]
        public IActionResult GetPhotosForModeration()
        {
            return Ok("Only admins and moderators can see this! Go away!");
        }

        [HttpPost("updateRoles/{username}")]
        [Authorize(Policy = "RequireAdmin")]
        public async Task<IActionResult> EditRoles(string username, RolesForUpdateDto rolesForUpdateDto)
        {
            var user = await _userManager.FindByNameAsync(username);
            var currentUserRoles = await _userManager.GetRolesAsync(user);
            var rolesForUpdate = rolesForUpdateDto.Roles;
            //rolesForUpdate = rolesForUpdate != null ? rolesForUpdate : new string[] {};
            rolesForUpdate = rolesForUpdate ?? new string[] { };

            var result = await _userManager.AddToRolesAsync(user, rolesForUpdate.Except(currentUserRoles));
            if (!result.Succeeded) return BadRequest("Couldn't add roles to user.");

            result = await _userManager.RemoveFromRolesAsync(user, currentUserRoles.Except(rolesForUpdate));
            if (!result.Succeeded) return BadRequest("Coulnd't remove roles from user.");

            return Ok(await _userManager.GetRolesAsync(user));
        }
    }
}