import { Component } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { LoadingController } from '@ionic/angular';

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
    private loadingController: LoadingController
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
          console.log('SUCCESS!');
          this.router.navigate(['/create-track-confirmation', { successful: true }]);
        },
        (error) => {
          console.log('ERROR!', error);
          this.router.navigate(['/create-track-confirmation', { successful: false }]);
        },
        () => {
          this.loadingController.dismiss();
          this.uploading = false;
          this.trackName = '';
          this.uploading = false;
        }
      );
  }

  onFileChange(file: File): void {
    if (file) {
      console.log('file.name', file.name);
      this.trackContents = file;
    }
  }

}