import { map } from 'rxjs/operators';
import { PaginatedResult } from './../models/pagination';
import { AuthService } from './auth.service';
import { Photo } from './../models/photo';
import { environment } from './../../environments/environment';
import { User } from './../models/user';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class UserService {
    baseUrl = environment.apiUrl + 'users/'
    mainPhotoUpdated = new Subject<any>()
    constructor(private http: HttpClient) { }

    getUsers(page?, itemsPerPage?, userParams?, created?): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>()
        var params = new HttpParams()
        if (page != null && itemsPerPage != null) {
            params = params.append("pageSize", itemsPerPage)
            params = params.append("pageNumber", page)
        }
        if (userParams != null) {
            params = params.append("minAge", userParams.minAge)
            params = params.append("maxAge", userParams.maxAge)
            params = params.append("gender", userParams.gender)
        }
        if (created != null)
            params = params.append("orderBy", created)
        return this.http.get<User[]>(this.baseUrl, { observe: 'response', params }).pipe(
            map(response => {
                paginatedResult.result = response.body
                if (response.headers.get("Pagination") != null)
                    paginatedResult.pagination = JSON.parse(response.headers.get("Pagination"))
                return paginatedResult
            })
        )
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + id)
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + id, user)
    }

    setMainPhoto(userId: number, id: number) {
        return this.http.post(this.baseUrl + userId + '/photos/' + id + '/setMain', {})
    }

    deletePhoto(userId: number, id: number) {
        return this.http.delete(this.baseUrl + userId + '/photos/' + id)
    }
}