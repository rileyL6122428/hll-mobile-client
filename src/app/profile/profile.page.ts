import { Component, OnInit } from '@angular/core';
import { TrackHttpClient } from 'hll-shared-client';
import { Track } from '../shared/components/track-list/track.model';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { zip, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DocumentPicker } from '@ionic-native/document-picker/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'hll-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [
    DocumentPicker
  ]
})
export class ProfilePage implements OnInit {

  tracks: Track[];

  constructor(
    private trackClient: TrackHttpClient,
    private alertController: AlertController,
    private docPicker: DocumentPicker,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchUserTracks();

    console.log('this.router.getCurrentNavigation().extras.state');
    console.log(this.router.getCurrentNavigation().extras.state);

    if (
      this.router.getCurrentNavigation().extras.state &&
      this.router.getCurrentNavigation().extras.state.trackUploadSuccessful
    ) {
      console.log('UPLOAD SUCCESSFUL');
    }
  }

  ionViewWillEnter(): void {
    // console.log('this.router.getCurrentNavigation().extras.state');
    // console.log(
    //   this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras
    // );

    // if (
    //   this.router.getCurrentNavigation() &&
    //   this.router.getCurrentNavigation().extras &&
    //   this.router.getCurrentNavigation().extras.state &&
    //   this.router.getCurrentNavigation().extras.state.trackUploadSuccessful
    // ) {
    //   console.log('UPLOAD SUCCESSFUL');
    // }
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

  async presentActionsList() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
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

  pickFile(): void {
    this.docPicker.getFile('all')
      .then(uri => console.log('uri', uri))
      .catch(reason => console.log('reason', reason));
  }

}
