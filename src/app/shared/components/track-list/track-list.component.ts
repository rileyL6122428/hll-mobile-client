import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  SimpleChanges,
  SimpleChange,
  OnChanges
} from '@angular/core';
import { Track } from 'src/app/shared/components/track-list/track.model';

@Component({
  selector: 'hll-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss'],
})
export class TrackListComponent implements OnChanges {

  @Input() tracks: Track[] | null[];
  @Input() playingTrack: Track;
  @Input() selectedTrack: Track;

  @Output() play: EventEmitter<Track>;
  @Output() pause: EventEmitter<Track>;
  @Output() delete: EventEmitter<Track>;

  @ViewChild('audioPlayer', { static: false })
  private audioPlayerViewChild: { nativeElement: HTMLAudioElement };

  constructor() {
    this.play = new EventEmitter();
    this.pause = new EventEmitter();
    this.delete = new EventEmitter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes');
    console.log(changes);
    console.log('audioPlayerViewChild');
    console.log(this.audioPlayerViewChild);
    if (this.playingTrackSet(changes.playingTrack)) {
      console.log('WILL CALL nativeElement.play()');
      const { nativeElement } = this.audioPlayerViewChild;
      nativeElement.play();
    }
  }

  ngDoCheck(): void {
    console.log('audioPlayerViewChild');
    console.log(this.audioPlayerViewChild);
  }

  emitPlay(track: Track): void {
    console.log('emitPlay track');
    console.log(track);
    if (track) {
      this.play.emit(track);
    }
  }

  emitPause(track: Track): void {
    console.log('emitPause track');
    console.log(track);
    if (track) {
      this.pause.emit(track);
    }
  }

  emitDelete(track: Track): void {
    if (track) {
      this.delete.emit(track);
    }
  }

  get progress(): number {
    let progress = 0;

    if (this.audioPlayerViewChild) {
      const { nativeElement } = this.audioPlayerViewChild;
      progress = nativeElement.currentTime;
    }

    return progress;
  }

  private playingTrackSet(playingTrack: SimpleChange): boolean {
    return !!playingTrack &&
      !playingTrack.previousValue &&
      !!playingTrack.currentValue &&
      !!this.audioPlayerViewChild;
  }

}
