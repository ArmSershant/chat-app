import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  onSubmit(form: NgForm) {
    this.authService.register(form.value).subscribe(
      (data) => {
        localStorage.setItem('Token', data.token);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['/app-login']);
      },
      (err) => {
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }
  constructor(private authService: AuthService, private router: Router) {}
}
