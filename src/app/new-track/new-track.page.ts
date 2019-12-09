import { Component, OnInit } from '@angular/core';
import { DocumentPicker } from '@ionic-native/document-picker/ngx';

@Component({
  selector: 'hll-new-track',
  templateUrl: './new-track.page.html',
  styleUrls: ['./new-track.page.scss'],
})
export class NewTrackPage implements OnInit {

  constructor(
    private docPicker: DocumentPicker
  ) { }

  ngOnInit() {
  }

  test(): void {
    console.log('INPUT CLICKED!!!');
  }

  pickFile(): void {
    this.docPicker.getFile('all')
      .then(uri => console.log('uri', uri))
      .catch(reason => console.log('reason', reason));
  }

}
