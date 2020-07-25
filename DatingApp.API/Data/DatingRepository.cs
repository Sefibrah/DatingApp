using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data {
    public class DatingRepository : IDatingRepository {
        private readonly DataContext _context;
        public DatingRepository (DataContext context) {
            _context = context;
        }
        public void Add<T> (T entity) where T : class {
            _context.Add (entity);
        }

        public void Delete<T> (T entity) where T : class {
            _context.Remove (entity);
        }

        public async Task<Photo> GetMainPhotoForUser (int id) {
            return await _context.Photos.Where (u => u.UserId == id).FirstOrDefaultAsync (p => p.IsMain);
        }

        public async Task<Photo> GetPhoto (int id) {
            return await _context.Photos.FirstOrDefaultAsync (p => p.Id == id);
        }

        public async Task<User> GetUser (int id) {
            return await _context.Users.Include (p => p.Photos).FirstOrDefaultAsync (u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers (UserParams userParams) {
            var users = _context.Users.Include (p => p.Photos).
            OrderByDescending (u => u.LastSeen).AsQueryable ();
            users = users.Where (u => u.Id != userParams.UserId);
            users = users.Where (u => u.Gender == userParams.Gender);
            if (userParams.MinAge != 18 || userParams.MaxAge != 99) {
                var minDob = DateTime.Today.AddYears (-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears (-userParams.MinAge);
                users = users.Where (u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!String.IsNullOrEmpty (userParams.OrderBy)) {
                switch (userParams.OrderBy) {
                    case "created":
                        users = users.OrderByDescending (u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending (u => u.LastSeen);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync (users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll () {
            return await _context.SaveChangesAsync () > 0 ? true : false;
        }
    }
}