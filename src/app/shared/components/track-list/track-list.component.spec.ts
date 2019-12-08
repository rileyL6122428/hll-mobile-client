import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackListComponent, trackListConfigToken, TrackListConfig } from './track-list.component';
import { Track } from './track.model';

describe('TrackListComponent', () => {

  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackListComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {
          provide: trackListConfigToken,
          useValue: {
            streamEndpoint: (track: Track) => `EXAMPLE_STREAM_ENDPOINT/${track.id}`
          } as TrackListConfig
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputted tracks are null', () => {
    let skeletonData: null[];

    beforeEach(() => {
      skeletonData = [null, null, null];
      component.tracks = skeletonData;
      fixture.detectChanges();
    });

    it('renders skeleton text for each null track', () => {
      const contentElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item ion-skeleton-text');

      expect(contentElements.length).toBe(3);
    });
  });

  describe('Inputted track are not null', () => {
    let tracks: Track[];

    beforeEach(async(() => {
      tracks = [
        {
          name: 'EXAMPLE_TRACK_NAME_1',
          id: 'EXAMPLE_ID_1',
          duration: 1,
          s3Key: 'EXAMPLE_S3_KEY_1',
          userId: 'EXAMPLE_USER_ID_1'
        },
        {
          name: 'EXAMPLE_TRACK_NAME_2',
          id: 'EXAMPLE_ID_2',
          duration: 2,
          s3Key: 'EXAMPLE_S3_KEY_2',
          userId: 'EXAMPLE_USER_ID_2'
        },
      ];

      component.tracks = tracks;
      fixture.detectChanges();
    }));

    it('renders a list of track names', () => {
      const contentElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.track-name');

      expect(contentElements.length).toBe(2);
      expect(contentElements[0].innerText).toContain('EXAMPLE_TRACK_NAME_1');
      expect(contentElements[1].innerText).toContain('EXAMPLE_TRACK_NAME_2');
    });

    it('emits a play event when play button is clicked', (done) => {
      component.play.subscribe((emittedTrack: Track) => {
        const secondTrack = tracks[1];
        expect(emittedTrack).toBe(secondTrack);
        done();
      });

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.play-button');

      const secondPlayButton = playButtons[1];
      secondPlayButton.click();
      fixture.detectChanges();
    });

    it('tells the audio element to play when play button is clicked', () => {
      const audioElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('audio');
      const secondAudioElement = audioElements[1];
      spyOn(secondAudioElement, 'play');

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.play-button');

      const secondPlayButton = playButtons[1];
      secondPlayButton.click();
      fixture.detectChanges();

      expect(secondAudioElement.play).toHaveBeenCalled();
    });

    it('emits a pause event when pause button is clicked', (done) => {
      component.pause.subscribe((emittedTrack: Track) => {
        const secondTrack = tracks[1];
        expect(emittedTrack).toBe(secondTrack);
        done();
      });

      const secondAudioElement = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('audio')[1];
      spyOnProperty(secondAudioElement, 'paused', 'get').and.returnValue(false);
      fixture.detectChanges();

      const pauseButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.pause-button');

      const secondPauseButton = pauseButtons[0];
      secondPauseButton.click();
      fixture.detectChanges();
    });

    it('tells the audio element to pause when pause button is clicked', () => {
      const audioElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('audio');

      const secondAudioElement = audioElements[1];
      spyOnProperty(secondAudioElement, 'paused', 'get').and.returnValue(false);
      spyOn(secondAudioElement, 'pause');

      fixture.detectChanges();

      const pauseButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.pause-button');

      const secondPauseButton = pauseButtons[0];
      secondPauseButton.click();
      fixture.detectChanges();

      expect(secondAudioElement.pause).toHaveBeenCalled();
    });

    it('emits a delete event when delete button is clicked', (done) => {
      component.delete.subscribe((emittedTrack: Track) => {
        const firstTrack = tracks[0];
        expect(emittedTrack).toBe(firstTrack);
        done();
      });

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('.delete-button');

      const firstPlayButton = playButtons[0];
      firstPlayButton.click();
      fixture.detectChanges();
    });

    it('adds audio elements with the correct src values', () => {
      const audioElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('audio');

      expect(audioElements.length).toEqual(2);
      expect(audioElements[0].src).toContain('EXAMPLE_STREAM_ENDPOINT/EXAMPLE_ID_1');
      expect(audioElements[1].src).toContain('EXAMPLE_STREAM_ENDPOINT/EXAMPLE_ID_2');
    });

    it('reloads audio element after completing a playthrough', () => {
      const audioElements = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('audio');
      const secondAudioElement = audioElements[1] as HTMLAudioElement;
      spyOn(secondAudioElement, 'load');

      secondAudioElement.dispatchEvent(new Event('ended'));
      fixture.detectChanges();

      expect(secondAudioElement.load).toHaveBeenCalled();
    });
  });
});
