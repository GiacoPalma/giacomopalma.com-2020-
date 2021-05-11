using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiacomoPalma.com.ViewModels
{
    public class ResumePostViewModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string Company { get; set; }
        public List<string> Tags { get; set; }
    }
}
