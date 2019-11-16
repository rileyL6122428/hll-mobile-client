import { Component } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    if (environment.skipAuth) {
      this.router.navigateByUrl('profile');
    } else {
      this.authorize();
    }
  }

  private authorize(): void {
    this.auth.authorize().subscribe((authSuccessful: boolean) => {
      if (authSuccessful) {
        this.router.navigate(['/profile']);
      } else {
        alert('Login failed. Try logging in later.');
      }
    });
  }

}
