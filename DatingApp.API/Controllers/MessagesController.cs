using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                return NotFound();
            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams messageParams)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageParams.UserId = userId;
            var messagesFromRepo = await _repo.GetMessagesForUser(messageParams);
            var messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(messagesFromRepo);
            Response.AddPaginationHeader(messagesFromRepo.CurrentPage, messagesFromRepo.TotalCount,
                messagesFromRepo.TotalPages, messagesFromRepo.PageSize);
            return Ok(messages);
        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessagesThread(int userId, int recipientId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var threadFromRepo = await _repo.GetMessagesThread(userId, recipientId);
            var messages = _mapper.Map<IEnumerable<MessageForReturnDto>>(threadFromRepo);
            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            messageForCreationDto.SenderId = userId;
            var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
            if (recipient == null)
                return NotFound();
            var message = _mapper.Map<Message>(messageForCreationDto);
            message.MessageSent = messageForCreationDto.Created;
            _repo.Add(message);
            var messageForReturn = _mapper.Map<MessageForReturnDto>(message);
            if (await _repo.SaveAll())
            {
                var mainPhoto = await _repo.GetMainPhotoForUser(sender.Id);
                messageForReturn.MessageSent = messageForCreationDto.Created;
                messageForReturn.SenderKnownAs = sender.KnownAs;
                messageForReturn.SenderPhotoUrl = mainPhoto.URL;
                return CreatedAtAction("GetMessage", new { userId, id = message.Id }, messageForReturn);
            }
            throw new Exception("Couldn't send this message");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecepientDeleted = true;
            if (messageFromRepo.RecepientDeleted && messageFromRepo.SenderDeleted)
                _repo.Delete(messageFromRepo);
            if (await _repo.SaveAll())
                return NoContent();
            throw new Exception("Couldn't delete this message.");
        }
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id, int userId){
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var messageFromRepo = await _repo.GetMessage(id);
            if(messageFromRepo == null)
                return NotFound();
            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;
            if(await _repo.SaveAll())
                return NoContent();
            throw new Exception("An error occured when trying to mark a message as read");
        }
    }
}