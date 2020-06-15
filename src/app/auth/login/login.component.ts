import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;

  initiatedPasswordlessLogin = false;
  errorMessage: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  login(): void {
    this.authService.initiateLoginByPasswordless(this.email)
      .then(_ => {
        this.initiatedPasswordlessLogin = true;
        this.errorMessage = null;
      })
      .catch(err => this.errorMessage = err.message);
  }
}
