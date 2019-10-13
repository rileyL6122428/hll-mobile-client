import { Component, ChangeDetectorRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import Auth0Cordova from '@auth0/cordova';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  idToken: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private safariViewController: SafariViewController,
    private changeDetector: ChangeDetectorRef,
    private auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    // (window as any).handleOpenURL = (url: string) => {
    //   console.log('HANDLE OPEN URL FIRED');
    //   console.log('HERE IS THE VALUE OF THE URL PASSED TO HANDLER:');
    //   console.log(url);

    //   this.changeDetector.detectChanges();

    //   this.safariViewController.hide();
    // };
  }
}
