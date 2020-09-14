using System;
using System.ComponentModel.DataAnnotations;

namespace GiacomoPalma.com.Models
{
	public class User
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Username { get; set; }
		[Required]
		public string Password { get; set; }
		public string RefreshToken { get; set; }
		public DateTime RefreshTokenExpiryTime { get; set; }
	}
}