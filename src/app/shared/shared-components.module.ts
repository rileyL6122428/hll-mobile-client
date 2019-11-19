import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLogoComponent } from './app-logo/app-logo.component';
import { TrackListComponent } from './components/track-list/track-list.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    AppLogoComponent,
    TrackListComponent
  ],
  exports: [
    AppLogoComponent,
    TrackListComponent
  ],
})
export class SharedComponentsModule { }
