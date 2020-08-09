using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers {
    [ApiController]
    [Route ("api/users/{userId}/photos")]
    public class PhotosController : ControllerBase {
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private Cloudinary _cloudinary;
        public PhotosController (IMapper mapper, IDatingRepository repo, IOptions<CloudinarySettings> cloudinaryConfig) {
            _mapper = mapper;
            _repo = repo;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account (
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary (acc);
        }

        [HttpGet ("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto (int id) {
            var photoFromRepo = await _repo.GetPhoto (id);
            var photo = _mapper.Map<PhotoForReturnDto> (photoFromRepo);
            return Ok (photo);
        }

        [HttpPost]
        public async Task<IActionResult> UploadPhoto (int userId, [FromForm] PhotoForUploadDto photoForUploadDto) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            var userFromRepo = await _repo.GetUser (userId);
            var file = photoForUploadDto.File;
            var result = new ImageUploadResult ();
            if (file.Length > 0) {
                using (var stream = file.OpenReadStream ()) {
                    var uploadParams = new ImageUploadParams () {
                    File = new FileDescription (file.Name, stream),
                    Transformation = new Transformation ().Width (500).Height (500).Crop ("fill").Gravity ("face")
                    };
                    result = _cloudinary.Upload (uploadParams);
                }
            }
            photoForUploadDto.PublicId = result.PublicId;
            photoForUploadDto.Url = result.Url.ToString ();
            var photo = _mapper.Map<Photo> (photoForUploadDto);
            if (!userFromRepo.Photos.Any (u => u.IsMain))
                photo.IsMain = true;
            userFromRepo.Photos.Add (photo);
            if (await _repo.SaveAll ()) {
                var photoToReturn = _mapper.Map<PhotoForReturnDto> (photo);
                return CreatedAtRoute ("GetPhoto", new { id = photo.Id, userId = photo.UserId }, photoToReturn);
            }
            return BadRequest ("Could not upload the photo!");
        }

        [HttpPost ("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            var userFromRepo = await _repo.GetUser (userId);
            if (!userFromRepo.Photos.Any (p => p.Id == id))
                return Unauthorized ();
            var photoFromRepo = await _repo.GetPhoto (id);
            if (photoFromRepo.IsMain)
                return BadRequest ("This photo is already main.");
            var mainUserPhoto = await _repo.GetMainPhotoForUser (userId);
            mainUserPhoto.IsMain = false;
            photoFromRepo.IsMain = true;
            if (await _repo.SaveAll ())
                return Ok ();
            return BadRequest ("Oops! Something's not right...");
        }

        [HttpDelete ("{id}")]
        public async Task<IActionResult> DeletePhoto (int userId, int id) {
            if (userId != int.Parse (User.FindFirst (ClaimTypes.NameIdentifier).Value))
                return Unauthorized ();
            var userFromRepo = await _repo.GetUser (userId);
            if (!userFromRepo.Photos.Any (p => p.Id == id))
                return Unauthorized ();
            var photoFromRepo = await _repo.GetPhoto (id);
            if (photoFromRepo.IsMain)
                return BadRequest ("You cannot delete your main photo, ever...");
            if (photoFromRepo.PublicId != null) {
                var deleteParams = new DeletionParams (photoFromRepo.PublicId);
                var result = _cloudinary.Destroy (deleteParams);
                if (result.Result == "ok")
                    _repo.Delete (photoFromRepo);
            } else
                _repo.Delete (photoFromRepo);
            if (await _repo.SaveAll ())
                return Ok ();
            return BadRequest ("Oops! Something's not right...");
        }
    }
}