import { Component } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Track } from '../shared/components/track-list/track.model';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { zip, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

@Component({
  selector: 'hll-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage {

  tracks: Track[];

  constructor(
    private trackClient: TrackHttpClient,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private router: Router,
    private auth: AuthService
  ) { }

  ionViewWillEnter(): void {
    this.fetchUserTracks();
  }

  private fetchUserTracks(): void {
    const skeletonTracks = [null, null, null, null, null];
    this.tracks = skeletonTracks;

    const tracks$ = this.trackClient.getTracks({
      userId: 'rileylittlefield@ymail.com'
    });

    const minimumDelay$ = timer(environment.minGetTracksDelay);

    zip(tracks$, minimumDelay$)
      .subscribe(([tracks]) => {
        this.tracks = tracks as Track[];
      });
  }

  confirmDeleteTrack(track: Track): void {
    this.alertController.create({
      header: `Are you sure you want to delete ${track.name}?`,
      message: 'This decision cannot be reversed.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'color-danger modal-button-color'
        },
        {
          text: 'Delete',
          cssClass: 'danger ion-color-danger',
          handler: () => this.deleteTrack(track)
        }
      ]
    })
      .then((alert) => alert.present());
  }

  private deleteTrack(targetTrack: Track): void {
    this.trackClient.delete({
      track: targetTrack,
      bearerToken: this.auth.idToken
    })
      .subscribe();

    this.tracks = this.tracks.filter(track => track !== targetTrack);
  }

  async presentActionsList() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'track-actions',
      buttons: [
        {
          text: 'Create new track',
          handler: () => {
            this.router.navigate(['/new-track']);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('CANCEL CLICKED');
          }
        }
      ]
    });

    await actionSheet.present();
  }

}
