import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from 'src/app/shared/components/track-list/track.model';

@Component({
  selector: 'hll-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
})
export class TrackListComponent {

  @Input() tracks: Track[] | null[];
  @Output() play: EventEmitter<Track>;
  @Output() delete: EventEmitter<Track>;

  constructor() {
    this.play = new EventEmitter();
    this.delete = new EventEmitter();
  }

  emitPlay(track: Track): void {
    if (track) {
      this.play.emit(track);
    }
  }

  emitDelete(track: Track): void {
    if (track) {
      this.delete.emit(track);
    }
  }

}
