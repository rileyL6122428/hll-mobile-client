import { NgModule } from '@angular/core';
import { AUTH_SERVICE_CONFIG_TOKEN, AuthServiceConfig } from './shared/auth/auth.service';

const authServiceConfig: AuthServiceConfig = {
  authorizationUrl: 'http://192.168.1.70:4200/#/home?mobile-login=true'
};

@NgModule({
  providers: [
    {
      provide: AUTH_SERVICE_CONFIG_TOKEN,
      useValue: authServiceConfig
    }
  ]
})
export class AppConfigModule { }
