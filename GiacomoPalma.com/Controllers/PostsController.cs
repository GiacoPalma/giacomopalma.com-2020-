using System.Collections.Generic;
using System.Linq;
using GiacomoPalma.com.Models;
using Microsoft.AspNetCore.Mvc;

namespace GiacomoPalma.com.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class PostsController : ControllerBase
	{
		private readonly DataContext _dataContext;
		
		public PostsController(DataContext dataContext)
		{
			_dataContext = dataContext;
		}

		[HttpGet]
		public ActionResult<List<BlogPost>> GetAll()
		{
			var posts = _dataContext.BlogPosts.ToList();
			return posts;
		}
	}
}