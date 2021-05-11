using Microsoft.EntityFrameworkCore;

namespace GiacomoPalma.com.Models
{
	public class DataContext : DbContext
	{
		public DbSet<ResumePost> ResumePosts { get; set; }
		
		public DbSet<User> Users { get; set; }
		
		public DbSet<Tag> Tags { get; set; }
		
		public DbSet<Project> Projects { get; set; }
		
		public DataContext(DbContextOptions options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
			modelBuilder.Entity<ResumePostTag>()
				.HasKey(t => new { t.ResumePostId, t.TagId });

			modelBuilder.Entity<ResumePostTag>()
				.HasOne(pt => pt.ResumePost)
				.WithMany(t => t.ResumePostTags)
				.HasForeignKey(pt => pt.ResumePostId);

			modelBuilder.Entity<ResumePostTag>()
				.HasOne(pt => pt.Tag)
				.WithMany(t => t.ResumePostTags)
				.HasForeignKey(pt => pt.TagId);
        }
	}
}