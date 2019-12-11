import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateTrackConfirmationPage } from './create-track-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTrackConfirmationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateTrackConfirmationPage]
})
export class CreateTrackConfirmationPageModule {}
