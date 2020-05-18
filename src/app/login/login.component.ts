import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'firebase';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: Observable<User>;
  email: string;
  emailSent = false;

  errorMessage: string;

  constructor(public fireAuth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.user = this.fireAuth.authState;

    const url = this.router.url;
    if (url.includes('signIn')) {
      this.confirmSignIn(url);
    }
  }

  async sendEmail(email) {
    try {
      await this.fireAuth.sendSignInLinkToEmail(email, environment.actionCodeSettings);
      window.localStorage.setItem('signInEmail', email);
      this.emailSent = true;
      this.errorMessage = null;
    } catch (err) {
      console.error(err);
      this.errorMessage = err.message;
    }
  }

  async confirmSignIn(url) {
    try {
      const signInLink = await this.fireAuth.isSignInWithEmailLink(url);
      if (!signInLink) { return; }

      const email = window.localStorage.getItem('signInEmail') || window.prompt('Please provide your email for confirmation.');
      const result = await this.fireAuth.signInWithEmailLink(email, url);
      window.localStorage.removeItem('signInEmail');

      console.log(result);
    }
     catch (err) {
      console.error(err);
      this.errorMessage = err.message;
    }
  }

  logout() {
    return this.fireAuth.signOut();
  }
}
