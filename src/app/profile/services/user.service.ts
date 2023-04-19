import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/Auth/models/user.model';

const AUTH_API = 'http://localhost:5000/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  public fetchUsers(): Observable<{ users: User[] }> {
    return this.http.get<{ users: User[] }>(AUTH_API + 'users', {
      withCredentials: true,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('Token'),
      },
    });
  }
}
