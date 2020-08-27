import { AlertifyjsService } from './../services/alertifyjs.service';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertify: AlertifyjsService) {

  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const roles = next.data['roles'] as Array<string>
    if (roles != null) {
      var result = this.authService.roleMatch(roles)
      if (result) return true
      else {
        this.alertify.error('You are forbidden to access this link!')
        this.router.navigate(['member-list'])
      }
    }
    if (this.authService.loggedIn()) return true
    this.alertify.error('You are unauthorized!')
    return this.router.createUrlTree(['home'])
  }

}
