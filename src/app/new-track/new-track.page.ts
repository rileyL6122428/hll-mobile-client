import { Component, ViewChild } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';

@Component({
  selector: 'hll-new-track',
  templateUrl: './new-track.page.html',
  styleUrls: ['./new-track.page.scss'],
})
export class NewTrackPage {

  trackName: string;
  private trackContents: File;

  @ViewChild('trackContentsInput', { static: true })
  private trackContentsInputVC: { nativeElement: HTMLInputElement };

  constructor(
    private trackClient: TrackHttpClient,
    private router: Router,
    private auth: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ionViewWillEnter(): void {
    this.trackName = '';
    this.trackContentsInputVC.nativeElement.value = null;
  }

  submit(): void {
    this.loadingController.create({
      message: 'Please wait.',
      spinner: 'bubbles'
    })
      .then((loader) => {
        loader.present();
        this.uploadTrack();
      });
  }

  private uploadTrack(): void {
    this.trackClient.upload({
      name: this.trackName,
      contents: this.trackContents,
      bearerToken: this.auth.idToken
    })

      .pipe(
        catchError((error) => of({ errorOccurred: true, error })),
        delay(1000),
        tap((piped) => {
          if (piped.errorOccurred) {
            throw piped.error;
          }
        })
      )

      .subscribe(
        () => {
          this.loadingController.dismiss();

          this.toastController.create({
            message: `${this.trackName} was created`,
            duration: 3000,
            color: 'dark',
            cssClass: 'center-text'
          })
            .then((toast) => {
              toast.present();
              this.router.navigate(['/profile'])
            });
        },

        () => {
          this.loadingController.dismiss();

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
            .then((alert) => alert.present());
        }
      );
  }

  onFileChange(file: File): void {
    if (file) {
      this.trackContents = file;
    }
  }
}
