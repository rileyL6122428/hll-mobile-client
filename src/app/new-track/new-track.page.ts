import { Component } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'hll-new-track',
  templateUrl: './new-track.page.html',
  styleUrls: ['./new-track.page.scss'],
})
export class NewTrackPage {

  trackName = '';
  uploading = false;
  private trackContents: File;

  constructor(
    private trackClient: TrackHttpClient,
    private router: Router,
    private auth: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  submit(): void {
    this.uploading = true;

    this.loadingController.create({
      message: 'Please wait.',
      spinner: 'bubbles'
    })
      .then((loadingElement) => loadingElement.present());

    this.trackClient.upload({
      name: this.trackName,
      contents: this.trackContents,
      bearerToken: this.auth.idToken
    })
      .subscribe(
        () => {
          this.toastController.create({
            message: `${this.trackName} was created`,
            duration: 3000,
            color: 'dark',
            cssClass: 'center-text'
          })
            .then((toast) => {
              toast.present();
              this.router.navigate(['/profile']);
            });
        },
        () => {
          this.alertController.create({
            header: 'An error occurred.',
            message: `We're sorry, we were unable to upload your track. Please try again at a later time.`,
            buttons: [
              {
                text: 'OK',
                role: 'cancel',
                handler: () => this.router.navigate(['/profile'])
              }
            ]
          })
            .then((alert) => alert.present())
        },
        () => {
          this.uploading = false;
          this.trackName = '';
          this.uploading = false;
        }
      );
  }

  onFileChange(file: File): void {
    if (file) {
      this.trackContents = file;
    }
  }

}
