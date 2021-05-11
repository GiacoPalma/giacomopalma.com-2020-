using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace GiacomoPalma.com.Models
{
	public class ResumePost
	{
		[Required]
		public int ResumePostId { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public string Content { get; set; }
		[Required]
		public string Company { get; set; }

		public List<ResumePostTag> ResumePostTags { get; set; } = new List<ResumePostTag>();
		public long CreationTime { get; set; }
		public long LastEditTime { get; set; }
		public long PublishTime { get; set; }
		public bool IsDraft { get; set; }
	}
}