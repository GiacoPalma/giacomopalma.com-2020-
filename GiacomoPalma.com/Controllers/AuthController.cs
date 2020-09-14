using System;
using System.Linq;
using GiacomoPalma.com.Models;
using GiacomoPalma.com.Services;
using GiacomoPalma.com.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;

namespace GiacomoPalma.com.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;
		private readonly DataContext _dataContext;

		public AuthController(IAuthService authService, DataContext dataContext)
		{
			_authService = authService;
			_dataContext = dataContext;
		}

		[HttpPost("login")]
		public ActionResult<AuthData> Post([FromBody] LoginViewModel model)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);

			var user = _dataContext.Users.FirstOrDefault(u => u.Username == model.Username);

			if (user == null)
			{
				return BadRequest(new {username = "no user with this username"});
			}
			
			var passwordValid = _authService.VerifyPassword(model.Password, user.Password);
			if (!passwordValid)
			{
				return BadRequest(new {password = "invalid password"});
			}

			var refreshToken = _authService.GenerateRefreshToken();

			user.RefreshToken = refreshToken;
			user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(30);

			_dataContext.SaveChanges();
			HttpContext.Response.Cookies.Append(
				"refresh_token",
				refreshToken,
				new CookieOptions
				{
					Expires = DateTime.Now.AddDays(7),
					HttpOnly = true,
					Domain = "localhost",
					Secure = false // TODO change to true in production
				});
			
			return _authService.GetAuthData(user.Id, refreshToken);
		}

		[HttpPost("register")]
		public ActionResult<User> Register([FromBody] LoginViewModel register)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);
			
			var newUser = new User
			{
				Username = register.Username,
				Password = _authService.HashPassword(register.Password)
			};
			_dataContext.Users.Add(newUser);

			try
			{
				_dataContext.SaveChanges();
			}
			catch (DbUpdateException e)
			{
				Console.WriteLine(e.Message);
				return BadRequest("Error creating user");
			}


			return newUser;
		}
		
		[HttpGet("refreshtoken")]
		public ActionResult<AuthData> Get()
		{
			try
			{
				HttpContext.Request.Cookies.TryGetValue("refresh_token", out var cookieValue);
				if (!string.IsNullOrEmpty(cookieValue))
				{
					// check if user has this refresh token
					var user = _dataContext.Users.FirstOrDefault(u =>
						u.RefreshToken == cookieValue && u.RefreshTokenExpiryTime > DateTime.Now);
					if (user == null)
					{
						return Unauthorized("Could not find valid refresh_token or it has expired");
					}

					// generate new refresh token since current one was used now.
					var refreshToken = _authService.GenerateRefreshToken();

					// update user with new refresh token
					user.RefreshToken = refreshToken;
					user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(30);
					_dataContext.SaveChanges();
					
					// append refresh token to http only cookie.
					HttpContext.Response.Cookies.Append(
						"refresh_token",
						refreshToken,
						new CookieOptions
						{
							Expires = DateTime.Now.AddDays(7),
							HttpOnly = true,
							Domain = "localhost",
							Secure = false // TODO change to true in production
						});

					return _authService.GetAuthData(user.Id, refreshToken);
				}
				else
				{
					return BadRequest("no refresh_token cookie found");
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
				return BadRequest("Error occurred when trying to refresh token");
			}
		}
	}
}