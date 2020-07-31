using System;

namespace DatingApp.API.Dtos
{
    public class MessageForCreationDto
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime Created { get; set; }
        public MessageForCreationDto()
        {
            Created = DateTime.Now;
        }
    }
}