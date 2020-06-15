import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { first, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  principal: Observable<User | null>;

  constructor(private fireAuth: AngularFireAuth) {
    this.principal = fireAuth.authState;
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

  async authenticate(url: string): Promise<boolean | string> {
    const isLoggedIn = await this.principal
      .pipe(first())
      .pipe(map(principal => principal !== null))
      .toPromise();
    if (isLoggedIn === true) { return true; }

    const loginResult = await this.completeLoginByPasswordless(url);
    return loginResult === null ? false : loginResult;
  }

  async initiateLoginByPasswordless(email: string): Promise<void> {
    await this.fireAuth.sendSignInLinkToEmail(email, environment.actionCodeSettings);
    AuthService.setEmail(email);
  }

  async completeLoginByPasswordless(url: string): Promise<string | null> {
    if (!await this.fireAuth.isSignInWithEmailLink(url)) { return null; }

    const email = AuthService.getAndRemoveEmail();
    await this.fireAuth.signInWithEmailLink(email, url);

    return AuthService.getAndRemoveRedirectUrl();
  }

  async logout(): Promise<void> {
    await this.fireAuth.signOut();
  }
}
