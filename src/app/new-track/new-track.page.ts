import { Component, ViewChild } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { of, timer, zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
      this.showLoader({
        then: () => this.uploadTrack()
      });
  }

  private showLoader(params: { then: () => void }) {
    this.loadingController.create({
      message: 'Please wait.',
      spinner: 'bubbles'
    })
      .then((loader) => {
        loader.present();
        params.then();
      });
  }

  private uploadTrack(): void {
    const upload$ = this.trackClient.upload({
      name: this.trackName,
      contents: this.trackContents,
      bearerToken: this.auth.idToken
    })
      .pipe(
        catchError((error) => of({ errorOccurred: true, error }))
      );

    const minDelay$ = timer(environment.minUploadTrackDelay);

    zip(upload$, minDelay$)
      .subscribe(
        ([upload]) => {
          this.loadingController.dismiss();

          if (!upload.errorOccurred) {
            this.showSuccessToast({
              then: () => this.router.navigate(['/profile'])
            });
          } else {
            this.showFailureAlert({
              onClose: () => this.router.navigate(['/profile'])
            });
          }
        }
      );
  }

  private showSuccessToast(params: { then: () => void }): void {
    this.toastController.create({
      message: `${this.trackName} was created`,
      duration: 3000,
      color: 'dark',
      cssClass: 'center-text'
    })
      .then((toast) => {
        toast.present();
        params.then();
      });
  }

  private showFailureAlert(params: { onClose: () => void }): void {
    this.alertController.create({
      header: 'An error occurred.',
      message: `We're sorry, we were unable to upload your track. Please try again at a later time.`,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: params.onClose
        }
      ]
    })
      .then((alert) => alert.present());
  }

  onFileChange(file: File): void {
    if (file) {
      this.trackContents = file;
    }
  }
}
