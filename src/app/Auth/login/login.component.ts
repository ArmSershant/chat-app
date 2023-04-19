import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Credentials } from '../models/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  user: Credentials = {
    email: '',
    password: '',
  };
  onSubmit(form: NgForm) {
    this.authService.login(form.value).subscribe(
      (data) => {
        localStorage.setItem('Token', data.token);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.router.navigate([`/app-profile`]);
      },
      (err) => {
        this.errorMessage = err.error;
        this.isLoginFailed = true;
      }
    );
  }

  constructor(private router: Router, private authService: AuthService) {}
}
