using Microsoft.EntityFrameworkCore;

namespace GiacomoPalma.com.Models
{
	public class DataContext : DbContext
	{
		public DbSet<BlogPost> BlogPosts { get; set; }
		
		public DbSet<User> Users { get; set; }
		
		public DbSet<BlogPostTag> BlogPostTags { get; set; }
		
		public DbSet<Tag> Tags { get; set; }
		
		public DbSet<Project> Projects { get; set; }
		
		public DataContext(DbContextOptions options) : base(options) { }
	}
}