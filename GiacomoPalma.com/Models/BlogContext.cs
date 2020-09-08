using Microsoft.EntityFrameworkCore;

namespace GiacomoPalma.com.Models
{
	public class BlogContext : DbContext
	{
		public DbSet<BlogPost> BlogPosts { get; set; }
		public DbSet<User> Users { get; set; }
		
		public DbSet<BlogPostTag> BlogPostTags { get; set; }
		
		public DbSet<Tag> Tags { get; set; }
		
		public BlogContext(DbContextOptions options) : base(options) { }
	}
}