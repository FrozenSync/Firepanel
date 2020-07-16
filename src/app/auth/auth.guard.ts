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
    const result = await this.authService.completePasswordlessAuthentication(url);

    switch (result.kind) {
      case 'alreadyAuthenticated': return true;
      case 'success': return this.router.createUrlTree([result]);
      case 'fail': {
        this.authService.setRedirectUrl(url);
        return this.router.createUrlTree(['/login']);
      }
    }
  }
}
