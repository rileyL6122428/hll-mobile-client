import { Component, OnInit } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Track } from '../shared/components/track-list/track.model';
import { AlertController } from '@ionic/angular';
import { zip, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'hll-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  tracks: Track[];

  constructor(
    private trackClient: TrackHttpClient,
    private alertController: AlertController
  ) { }

  ngOnInit() {
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
          cssClass: 'color-danger modal-button-color',
          handler: () => {
            console.log('DELETE TRACK CANCELLED');
          }
        },
        {
          text: 'Delete',
          cssClass: 'danger ion-color-danger',
          handler: () => {
            console.log('DELETE TRACK CONFIRMED');
          }
        }
      ]
    })
      .then((alert) => alert.present());
  }

}
