namespace GiacomoPalma.com.ViewModels
{
	public class AuthData
	{
		public string Token { get; set; }
		public long TokenExpirationTime { get; set; }

		public string RefreshToken { get; set; }
	}
}