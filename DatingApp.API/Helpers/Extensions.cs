using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message){
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }
        public static int GetAge(this DateTime response, DateTime birthday){
            var age = DateTime.Now.Year - birthday.Year;
            if(birthday < DateTime.Now)
                age--;
            return age;
        }
    }
}

