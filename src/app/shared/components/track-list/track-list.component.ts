import {
  Component,
  EventEmitter,
  Input,
  Output,
  InjectionToken,
  Inject
} from '@angular/core';
import { Track } from 'src/app/shared/components/track-list/track.model';

export interface TrackListConfig {
  streamEndpoint: (track: Track) => string;
}

export const trackListConfigToken = new InjectionToken<TrackListConfig>('trackListConfigToken');

@Component({
  selector: 'hll-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.scss']
})
export class TrackListComponent {

  @Input() tracks: Track[] | null[];

  @Output() play: EventEmitter<Track>;
  @Output() pause: EventEmitter<Track>;
  @Output() delete: EventEmitter<Track>;

  constructor(
    @Inject(trackListConfigToken) private config: TrackListConfig,
  ) {
    this.play = new EventEmitter();
    this.pause = new EventEmitter();
    this.delete = new EventEmitter();
  }

  emitPlay(track: Track): void {
    if (track) {
      this.play.emit(track);
    }
  }

  emitPause(track: Track): void {
    if (track) {
      this.pause.emit(track);
    }
  }

  emitDelete(track: Track): void {
    if (track) {
      this.delete.emit(track);
    }
  }

  streamEndpoint(track: Track): string {
    return track ? this.config.streamEndpoint(track) : '';
  }

  triggerChangeDetection(): void {
    // NOOP TO TRIGGER CHANGE DETECTION
  }

}
