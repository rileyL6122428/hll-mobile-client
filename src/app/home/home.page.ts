import { Component } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private auth: AuthService
  ) {}

  login(): void {
    this.auth.authorize().subscribe(authResult => {
      if (authResult) {
        alert(`AUTH SUCCESSFUL: ${this.auth.idToken}`);
      } else {
        alert('AUTH FAILURE OCCURRED');
      }
    });
  }

}
