import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLogoComponent } from './app-logo/app-logo.component';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AppLogoComponent
  ],
  exports: [
    AppLogoComponent
  ],
})
export class SharedModule { }
