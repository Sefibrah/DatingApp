import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(
        req: import("@angular/common/http").HttpRequest<any>,  //znat ce je li 400+ ili 500+ status
        next: import("@angular/common/http").HttpHandler):
        import("rxjs").Observable<import("@angular/common/http").HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(response => {
                //kako handlamo error u NG
                if (response.status === 401) return throwError(response.statusText)
                if (response instanceof HttpErrorResponse) {
                    const applicationError = response.headers.get("Application-Error")
                    if (applicationError) return throwError(applicationError)
                    const serverError = response.error
                    let modalStateErrors = ''
                    if (serverError.errors && typeof serverError.errors === 'object') {
                        for (const key in serverError.errors) {
                            if (serverError.errors[key])
                                modalStateErrors += serverError.errors[key] + '\n'
                        }
                    }
                    return throwError(modalStateErrors || serverError || "Server error")
                }
            })
        )
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}