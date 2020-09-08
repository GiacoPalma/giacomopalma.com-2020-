using GiacomoPalma.com.ViewModels;

namespace GiacomoPalma.com.Services
{
	public interface IAuthService
	{
		AuthData GetAuthData(int id);
		string HashPassword(string password);
		bool VerifyPassword(string actualPassword, string hashedPassword);
	}
}