using System.Linq;
using GiacomoPalma.com.Models;
using GiacomoPalma.com.Services;
using GiacomoPalma.com.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GiacomoPalma.com.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;
		private readonly BlogContext _blogContext;

		public AuthController(IAuthService authService, BlogContext blogContext)
		{
			_authService = authService;
			_blogContext = blogContext;
		}

		[HttpPost("login")]
		public ActionResult<AuthData> Post([FromBody] LoginViewModel model)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var user = _blogContext.Users.FirstOrDefault(u => u.Username == model.Username);

			if (user == null)
			{
				return BadRequest(new {username = "no user with this username"});
			}
			
			var passwordValid = _authService.VerifyPassword(model.Password, user.Password);
			if (!passwordValid)
			{
				return BadRequest(new {password = "invalid password"});
			}

			return _authService.GetAuthData(user.Id);
		}
	}
}