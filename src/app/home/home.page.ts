import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  leUrl = 'unset';

  result = 'unset';

  constructor(
    private authService: AuthService,
    private safariViewController: SafariViewController,
    private changeDetector: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  login(): void {
    console.log('login button clicked!');
    // if(!this.authService.loggedIn && !this.authService.loading; ) {
    //   this.authService.login();
    // }

    this.auth.authorize().subscribe(authResult => {
      if (authResult) {
        alert(`AUTH SUCCESSFUL: ${this.auth.idToken}`);
      } else {
        alert('AUTH FAILURE OCCURRED');
      }
    });
  }

  ngOnInit(): void {

    // setTimeout(() => {
      // console.log('HELLO WORLD!');
      // this.safariViewController.isAvailable()
      //   .then((available: boolean) => {
      //     if (available) {
      //       this.safariViewController.show({
      //         // url: 'https://google.com',
      //         // url: 'http://192.168.1.70:8100/home',
      //         url: 'http://192.168.1.70:4200/#/home?mobile-login=true',
      //         // url: 'http://192.168.1.70:4200/#/home',
      //         // url: 'io.ionic.starter://callback#sup=yo',
      //         // url: 'starter.ionic.io://callback#sup=yo',
      //         hidden: false,
      //         animated: true,
      //         transition: 'curl',
      //         enterReaderModeIfAvailable: true,
      //         tintColor: '#ff0000'
      //       })
      //         .subscribe((result: any) => {
      //           this.result = result;
      //           if (result.event === 'opened') {
      //             console.log('Opened');
      //             // this.safariViewController.
      //           } else if (result.event === 'loaded') {
      //             console.log('Loaded');
      //           } else if (result.event === 'closed') {
      //             console.log('Closed');
      //           }
      //         });
      //     }
      //   });
    // }, 2000);
  }

}
