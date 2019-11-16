import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackListComponent } from './track-list.component';
import { Track } from './track.model';

describe('TrackListComponent', () => {
  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        .querySelectorAll('ion-item-sliding ion-item ion-skeleton-text');

      expect(contentElements.length).toBe(3);
    });

    it('does not emit a play event when selected track is null', () => {
      const emitPlaySpy = spyOn(component.play, 'next');

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item-sliding ion-item-options[side="start"] ion-item-option');

      Array
        .from(playButtons)
        .forEach((playButtonElement: HTMLElement) => {
          playButtonElement.click();
          fixture.detectChanges();
        });
      expect(emitPlaySpy).not.toHaveBeenCalled();
    });

    it('does not emit a delete event when selected track is null', () => {
      const emitDeleteSpy = spyOn(component.delete, 'next');

      const deleteButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item-sliding ion-item-options[side="end"] ion-item-option');

      Array
        .from(deleteButtons)
        .forEach((playButtonElement: HTMLElement) => {
          playButtonElement.click();
          fixture.detectChanges();
        });
      expect(emitDeleteSpy).not.toHaveBeenCalled();
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
        .querySelectorAll('ion-item-sliding ion-item');

      expect(contentElements.length).toBe(2);
      expect(contentElements[0].innerText).toContain('EXAMPLE_TRACK_NAME_1');
      expect(contentElements[1].innerText).toContain('EXAMPLE_TRACK_NAME_2');
    });

    it('emits a play event when play button is clicked', (done) => {
      component.play.subscribe((track: Track) => {
        const secondTrack = tracks[1];
        expect(track).toBe(secondTrack);
        done();
      });

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item-sliding ion-item-options[side="start"] ion-item-option');

      const secondPlayButton = playButtons[1];
      secondPlayButton.click();
      fixture.detectChanges();
    });

    it('emits a delete event when delete button is clicked', (done) => {
      component.delete.subscribe((track: Track) => {
        const firstTrack = tracks[0];
        expect(track).toBe(firstTrack);
        done();
      });

      const playButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item-sliding ion-item-options[side="end"] ion-item-option');

      const firstPlayButton = playButtons[0];
      firstPlayButton.click();
      fixture.detectChanges();
    });
  });
});
