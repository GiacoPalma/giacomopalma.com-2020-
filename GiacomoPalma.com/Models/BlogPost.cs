using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace GiacomoPalma.com.Models
{
	public class BlogPost
	{
		[Required]
		public int BlogPostId { get; set; }
		[Required]
		public string Title { get; set; }
		[Required]
		public string Content { get; set; }

		public List<BlogPostTag> BlogPostTags { get; set; } = new List<BlogPostTag>();
		public long CreationTime { get; set; }
		public long LastEditTime { get; set; }
		public long PublishTime { get; set; }
		public bool IsDraft { get; set; }
	}
}