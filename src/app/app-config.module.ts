import { NgModule } from '@angular/core';
import { AUTH_SERVICE_CONFIG_TOKEN, AuthServiceConfig } from './shared/auth/auth.service';
import { TrackClientConfig, trackClientConfigToken } from 'hll-shared-client';

const localIP = '172.20.10.2';

const authServiceConfig: AuthServiceConfig = {
  authorizationUrl: `http://${localIP}:4200/#/home?mobile-login=true`
};

const trackClientConfig: TrackClientConfig = {
  urls: {
    upload: `http://${localIP}:8080/api/private/track`,
    getAllForUser: `http://${localIP}:8080/api/public/tracks`,
    delete: (trackId: string) => `http://${localIP}:8080/api/private/track/${trackId}`
  }
};

@NgModule({
  providers: [
    {
      provide: AUTH_SERVICE_CONFIG_TOKEN,
      useValue: authServiceConfig
    },
    {
      provide: trackClientConfigToken,
      useValue: trackClientConfig
    }
  ]
})
export class AppConfigModule { }
