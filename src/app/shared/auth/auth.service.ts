import { Injectable, InjectionToken, Inject } from '@angular/core';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import {  ReplaySubject, Observable } from 'rxjs';

export interface AuthServiceConfig {
  authorizationUrl: string;
}

export const AUTH_SERVICE_CONFIG_TOKEN = new InjectionToken('AUTH_SERVICE_CONFIG_TOKEN');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _idToken: string;
  private authorizationResult: ReplaySubject<boolean>;

  constructor(
    private safariViewController: SafariViewController,
    @Inject(AUTH_SERVICE_CONFIG_TOKEN) private config: AuthServiceConfig
  ) {
    this.authorizationResult = new ReplaySubject<boolean>(1);
  }

  authorize(): Observable<boolean> {
    if (!this.authRedirectCallbackSet) {
      this.setAuthRedirectCallback();
    }
    this.goToAuthorizationServer();
    return this.authorizationResult;
  }

  private get authRedirectCallbackSet(): boolean {
    return !!((window as any).handleOpenURL);
  }

  private setAuthRedirectCallback(): void {
    (window as any).handleOpenURL = (url: string) => {
      this.safariViewController.hide();
      const authorized = this.handleAuthorizationResult(url);
      this.authorizationResult.next(authorized);
    };
  }

  private handleAuthorizationResult(url: string): boolean {
    const hashParams = url
      .split('#')[1]
      .split('&')
      .map((keyValueString) => keyValueString.split('='))
      .reduce((hashParmasAccum, [key, value]) => {
        hashParmasAccum[key] = value;
        return hashParmasAccum;
      }, {});

    this._idToken = hashParams['id_token'];
    return 'id_token' in hashParams;
  }

  private goToAuthorizationServer(): void {
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: this.config.authorizationUrl,
            hidden: false,
            animated: true,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
            .subscribe((result: any) => {
              console.log('SAFARI VIEW CONTROLLER RESULT');
              console.log(result);
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            });
        }
      });
  }

  public get idToken(): string {
    return this._idToken;
  }
}
