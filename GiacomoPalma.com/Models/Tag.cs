using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GiacomoPalma.com.Models
{
	public class Tag
	{
		[Required]
		public int TagId { get; set; }
		[Required]
		public string Name { get; set; }
		public List<BlogPostTag> BlogPostTags { get; set; } = new List<BlogPostTag>();
	}
}