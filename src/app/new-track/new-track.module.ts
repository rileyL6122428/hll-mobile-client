import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewTrackPage } from './new-track.page';
import { DocumentPicker } from '@ionic-native/document-picker/ngx';

const routes: Routes = [
  {
    path: '',
    component: NewTrackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NewTrackPage],
  providers: [
    DocumentPicker
  ]
})
export class NewTrackPageModule {}
