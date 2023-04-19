import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Credentials } from '../models/credentials.model';

const AUTH_API = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  register(user: User): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      httpOptions
    );
  }

  login(credentials: Credentials): Observable<any> {
    return this.http.post(
      AUTH_API + 'login',
      {
        email: credentials.email,
        password: credentials.password,
      },
      httpOptions
    );
  }
}
