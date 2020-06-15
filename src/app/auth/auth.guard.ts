import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const url = state.url;
    const result = await this.authService.authenticate(url);

    if (result === true) {
      return true;
    } else if (result === false) {
      this.authService.setRedirectUrl(url);
      return this.router.createUrlTree(['/login']);
    } else {
      return this.router.createUrlTree([result]);
    }
  }
}
