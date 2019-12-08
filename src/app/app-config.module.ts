import { NgModule } from '@angular/core';
import { AUTH_SERVICE_CONFIG_TOKEN, AuthServiceConfig } from './shared/auth/auth.service';
import { TrackClientConfig, trackClientConfigToken } from 'hll-shared-client';
import { TrackListConfig, trackListConfigToken } from './shared/components/track-list/track-list.component';
import { Track } from './shared/components/track-list/track.model';

const localIP = '192.168.1.70';

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

const trackListConfig: TrackListConfig = {
  streamEndpoint: (track: Track) => `http://${localIP}:8080/api/public/track/${track.id}/stream`
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
    },
    {
      provide: trackListConfigToken,
      useValue: trackListConfig
    }
  ]
})
export class AppConfigModule { }
