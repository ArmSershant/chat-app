import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Chat';
  onLogout(): void {
    window.localStorage.removeItem('Token');
    window.localStorage.removeItem('chats');
    this.router.navigate([`/app-login`]);
  }
  constructor(private router: Router) {}
}
