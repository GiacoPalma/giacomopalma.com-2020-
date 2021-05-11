using System.ComponentModel.DataAnnotations;

namespace GiacomoPalma.com.Models
{
	public class ResumePostTag
	{
		public int Id { get; set; }
		[Required]
		public int ResumePostId { get; set; }
		public ResumePost ResumePost { get; set; }
		[Required]
		public int TagId { get; set; }
		public Tag Tag { get; set; }
	}
}