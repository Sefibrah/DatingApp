using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(p =>
                  p.Photos.FirstOrDefault(p => p.IsMain).URL))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(u =>
                  u.DateOfBirth.GetAge(u.DateOfBirth)));
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(p =>
                  p.Photos.FirstOrDefault(p => p.IsMain).URL))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(u =>
                  u.DateOfBirth.GetAge(u.DateOfBirth)));
            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForUploadDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageForReturnDto>()
                .ForMember(m => m.SenderPhotoUrl, opt =>
                opt.MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).URL))
                .ForMember(m => m.RecipientPhotoUrl, opt =>
                opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).URL));
        }
    }
}