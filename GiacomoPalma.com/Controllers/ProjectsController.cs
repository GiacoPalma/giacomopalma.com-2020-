using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using GiacomoPalma.com.Models;
using GiacomoPalma.com.ViewModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.SpaServices.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace GiacomoPalma.com.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ProjectsController : ControllerBase
	{
		private readonly DataContext _dataContext;
		private readonly IConfiguration _configuration;
		private readonly ISpaStaticFileProvider _webHostEnvironment;
		public ProjectsController(DataContext dataContext, IConfiguration configuration,
			ISpaStaticFileProvider webHostEnvironment)
		{
			_dataContext = dataContext;
			_configuration = configuration;
			_webHostEnvironment = webHostEnvironment;
		}
		
		[HttpPost]
		public async Task<ActionResult<Project>> Create()
		{
			if (!HttpContext.Request.HasFormContentType && !HttpContext.Request.Form.Files.Any())
				return BadRequest("no multipart form sent!");
			
			var dir = Directory.GetCurrentDirectory();
			var uploadDir = _configuration.GetValue<string>("UploadDirectory");
			var thumbnailBasePath = _configuration.GetValue<string>("ProjectImagesBasePath");
			var root = Path.Combine(dir, uploadDir);
			if (string.IsNullOrEmpty(root))
			{
				return BadRequest($"Could not find upload directory: {root}");
			}
			
			Request.Form.TryGetValue("name", out var name);
			Request.Form.TryGetValue("description", out var description);
			Request.Form.TryGetValue("url", out var url);

			if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description) || string.IsNullOrEmpty(url))
				return BadRequest("Missing name, description or url");

			var existingProject = _dataContext.Projects.FirstOrDefault(p => p.Name == name);
			if (existingProject != null)
			{
				return BadRequest("Project with same name already exists");
			}
			
			var file = Request.Form.Files[0];
			await using var fStream = new FileStream(Path.Combine(root, file.FileName), FileMode.Create, FileAccess.Write, FileShare.None);
			await file.CopyToAsync(fStream);

			var newProject = new Project
			{
				Name = name,
				Description = description,
				Thumbnail = Path.Combine(thumbnailBasePath, file.FileName),
				Url = url
			};
			
			// ReSharper disable once MethodHasAsyncOverload
			_dataContext.Projects.Add(newProject);

			try
			{
				await _dataContext.SaveChangesAsync();
			}
			catch (DbUpdateException e)
			{
				Console.WriteLine(e.Message);
				return BadRequest("Error creating project");
			}

			return newProject;
		}

		[HttpPut("{id}")]
		public async Task<ActionResult<Project>> Update(int id)
		{
			if (!HttpContext.Request.HasFormContentType)
				return BadRequest("no multipart form sent!");

			Request.Form.TryGetValue("name", out var name);
			Request.Form.TryGetValue("description", out var description);
			Request.Form.TryGetValue("url", out var url);

			if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description) || string.IsNullOrEmpty(url))
				return BadRequest("Missing name, description or url");

			var existingProject = _dataContext.Projects.FirstOrDefault(p => p.Id == id);
			if (existingProject == null)
			{
				return BadRequest("Project does not exist");
			}

			if (HttpContext.Request.Form.Files.Any())
			{
				var dir = Directory.GetCurrentDirectory();
				var uploadDir = _configuration.GetValue<string>("UploadDirectory");
				var thumbnailBasePath = _configuration.GetValue<string>("ProjectImagesBasePath");
				var root = Path.Combine(dir, uploadDir);
				if (string.IsNullOrEmpty(root))
				{
					return BadRequest($"Could not find upload directory: {root}");
				}

				var file = Request.Form.Files[0];
				await using var fStream = new FileStream(Path.Combine(root, file.FileName), FileMode.Create,
					FileAccess.Write, FileShare.None);
				await file.CopyToAsync(fStream);

				existingProject.Thumbnail = Path.Combine(thumbnailBasePath, file.FileName);
			}
			
			existingProject.Name = name;
			existingProject.Description = description;
			existingProject.Url = url;

			try
			{
				await _dataContext.SaveChangesAsync();
			}
			catch (DbUpdateException e)
			{
				Console.WriteLine(e.Message);
				return BadRequest("Error creating project");
			}

			return existingProject;
		}

		[HttpGet]
		public ActionResult<List<Project>> GetAll()
		{
			var projects = _dataContext.Projects.ToList();
			return projects;
		}

		[HttpGet("{id}")]
		public ActionResult<Project> Get(int id)
		{
			if (id <= 0)
			{
				return BadRequest("Invalid id supplied");
			}
			return _dataContext.Projects.FirstOrDefault(p => p.Id == id);
		}
	}
}