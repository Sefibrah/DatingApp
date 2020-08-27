import { AuthService } from './../services/auth.service';
import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  isVisible: boolean = false
  @Input() set appHasRole(roles: string[]) {
    const userRoles = this.authService.decodedToken.role as Array<string>;
    // if no roles clear the view container ref
    if (!userRoles) {
      this.viewContainerRef.clear();
    }
    // if user has role needed then render the element
    if (this.authService.roleMatch(roles)) {
      if (!this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }
  }

  constructor(private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService) { }
}
