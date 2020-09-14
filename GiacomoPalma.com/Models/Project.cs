using System.ComponentModel.DataAnnotations;

namespace GiacomoPalma.com.Models
{
	public class Project
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public string Name { get; set; }
		[Required]
		public string Description { get; set; }
		public string Url { get; set; }
		public string Thumbnail { get; set; }
	}
}