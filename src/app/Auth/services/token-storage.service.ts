import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const AUTH_API = 'http://localhost:5000/';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private http: HttpClient) {}
  public fetchUser(): Observable<User> {
    return this.http.get<User>(AUTH_API + `profile`, {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Token'),
      },
    });
  }
}
