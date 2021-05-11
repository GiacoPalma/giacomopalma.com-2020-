using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GiacomoPalma.com.Models;
using GiacomoPalma.com.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace GiacomoPalma.com.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ResumePostsController : ControllerBase
	{
		private readonly DataContext _dataContext;
		
		public ResumePostsController(DataContext dataContext)
		{
			_dataContext = dataContext;
		}

		[HttpGet]
		public ActionResult<List<ResumePost>> GetAll()
		{
			var posts = _dataContext.ResumePosts.ToList();
			return posts;
		}

		[HttpPost]
		public ActionResult<ResumePost> Create([FromBody] ResumePostViewModel model)
        {
			if (!ModelState.IsValid) return BadRequest(ModelState);

			// create ResumePost
			var newResumePost = new ResumePost
			{
				Title = model.Title,
				Content = model.Content,
				Company = model.Company,
				IsDraft = true,
				ResumePostTags = new List<ResumePostTag>(),
			};

			// add tag list
			var tagList = new List<ResumePostTag>();

			foreach (var tag in model.Tags)
			{
				ResumePostTag resumePostTag;

				var tagExist = _dataContext.Tags.FirstOrDefault(dbTag => dbTag.Name == tag);
				if (tagExist != null)
				{
					resumePostTag = new ResumePostTag
					{
						ResumePostId = newResumePost.ResumePostId,
						TagId = tagExist.TagId,
					};
				} 
				else
                {
					var newTag = new Tag
					{
						Name = tag
					};

					resumePostTag = new ResumePostTag
					{
						ResumePostId = newResumePost.ResumePostId,
						TagId = newTag.TagId,
					};
				}

				tagList.Add(resumePostTag);

				// check if tag exists
				// add tag to correct ResumePostTag

			}

			return newResumePost;
		}
	}
}