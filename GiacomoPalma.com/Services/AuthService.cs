using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using CryptoHelper;
using GiacomoPalma.com.ViewModels;
using Microsoft.IdentityModel.Tokens;

namespace GiacomoPalma.com.Services
{
	public class AuthService : IAuthService
	{
		private string _jwtSecret;
		private int _jwtLifespan;

		public AuthService(string jwtSecret, int jwtLifespan)
		{
			_jwtSecret = jwtSecret;
			_jwtLifespan = jwtLifespan;
		}
		
		public AuthData GetAuthData(int id, string refreshToken)
		{
			var expirationTime = DateTime.UtcNow.AddSeconds(_jwtLifespan);
			var tokenDescriptor = new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(new[]
				{
					new Claim(ClaimTypes.NameIdentifier, id.ToString()), 
				}),
				Expires = expirationTime,
				SigningCredentials = new SigningCredentials(
					new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret)),
					SecurityAlgorithms.HmacSha256Signature)
			};
			
			var tokenHandler = new JwtSecurityTokenHandler();
			var token = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

			return new AuthData
			{
				Token = token,
				TokenExpirationTime = ((DateTimeOffset) expirationTime).ToUnixTimeSeconds(),
				RefreshToken = refreshToken,
			};
		}

		public string GenerateRefreshToken()
		{
			var randomNumber = new byte[32];
			using var rng = RandomNumberGenerator.Create();
			rng.GetBytes(randomNumber);
			return Convert.ToBase64String(randomNumber);
		}

		public string HashPassword(string password)
		{
			return Crypto.HashPassword(password);
		}

		public bool VerifyPassword(string actualPassword, string hashedPassword)
		{
			return Crypto.VerifyHashedPassword(hashedPassword, actualPassword);
		}
	}
}