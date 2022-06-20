using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Model
{
  public class MailRequest
  {
    public string ToEmail { get; set; }

    public string Subject { get; set; }

    public string Body { get; set; }

    public string Attachments { get; set; }
  }
}
