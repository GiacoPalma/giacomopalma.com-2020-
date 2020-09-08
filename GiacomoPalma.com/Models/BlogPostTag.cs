using System.ComponentModel.DataAnnotations;

namespace GiacomoPalma.com.Models
{
	public class BlogPostTag
	{
		public int Id { get; set; }
		[Required]
		public int BlogPostId { get; set; }
		public BlogPost BlogPost { get; set; }
		[Required]
		public int TagId { get; set; }
		public Tag Tag { get; set; }
	}
}