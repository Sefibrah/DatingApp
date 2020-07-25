using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.API.Helpers {
    public static class Extensions {
        public static void AddApplicationError (this HttpResponse response, string message) {
            response.Headers.Add ("Application-Error", message);
            response.Headers.Add ("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add ("Access-Control-Allow-Origin", "*");
        }
        public static void AddPaginationHeader (this HttpResponse response, 
        int currentPage, int totalItems, int totalPages, int pageSize) {
            var paginationHeader = new PaginationHeader (currentPage, pageSize, totalItems, totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add ("Pagination", JsonConvert.SerializeObject (paginationHeader, camelCaseFormatter));
            response.Headers.Add ("Access-Control-Expose-Headers", "Pagination");
        }
        public static int GetAge (this DateTime response, DateTime birthday) {
            var age = DateTime.Now.Year - birthday.Year;
            if (birthday < DateTime.Now)
                age--;
            return age;
        }
    }
}