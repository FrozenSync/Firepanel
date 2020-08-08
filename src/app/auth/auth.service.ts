import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';
import { map, take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthResult } from './auth-result';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  principal: User | null;

  constructor(private ngFireAuth: AngularFireAuth, private router: Router) {
    ngFireAuth.user.subscribe(user => this.principal = user);
  }

  private static getAndRemoveEmail(): string {
    const result = localStorage.getItem('email') || window.prompt('Please enter your email for confirmation.');
    localStorage.removeItem('email');
    return result;
  }

  private static setEmail(email: string): void {
    localStorage.setItem('email', email);
  }

  private static getAndRemoveRedirectUrl(): string {
    const result = localStorage.getItem('redirectUrl');
    localStorage.removeItem('redirectUrl');
    return result ?? '';
  }

  setRedirectUrl(redirectUrl: string): void {
    localStorage.setItem('redirectUrl', redirectUrl);
  }

  async initiatePasswordlessAuthentication(email: string): Promise<void> {
    await this.ngFireAuth.sendSignInLinkToEmail(email, environment.actionCodeSettings);
    AuthService.setEmail(email);
  }

  async completePasswordlessAuthentication(url: string): Promise<AuthResult> {
    if (await this.isAuthenticated()) { return { kind: 'alreadyAuthenticated' }; }
    if (!await this.ngFireAuth.isSignInWithEmailLink(url)) { return { kind: 'fail' }; }

    const email = AuthService.getAndRemoveEmail();
    await this.ngFireAuth.signInWithEmailLink(email, url);

    const redirectionUrl = AuthService.getAndRemoveRedirectUrl();
    return { kind: 'success', redirectionUrl };
  }

  private isAuthenticated(): Promise<boolean> {
    return this.ngFireAuth.user.pipe(
      take(1),
      map(it => it !== null),
    ).toPromise();
  }

  async logout(): Promise<void> {
    await this.ngFireAuth.signOut();
    this.router.navigate(['login']).catch(err => console.error(err));
  }
}
