import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackListComponent } from './track-list.component';

fdescribe('TrackListComponent', () => {
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

  describe('null track list', () => {
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
        .querySelectorAll('ion-item-sliding ion-item-options[start] ion-item-option');

      Array
        .from(playButtons)
        .forEach((playButtonElement: HTMLElement) => {
          playButtonElement.click();
          fixture.detectChanges();
          expect(emitPlaySpy).not.toHaveBeenCalled();
        });
    });

    it('does not emit a delete event when selected track is null', () => {
      const emitDeleteSpy = spyOn(component.delete, 'next');

      const deleteButtons = fixture
        .debugElement
        .nativeElement
        .querySelectorAll('ion-item-sliding ion-item-options[end] ion-item-option');

      Array
        .from(deleteButtons)
        .forEach((playButtonElement: HTMLElement) => {
          playButtonElement.click();
          fixture.detectChanges();
          expect(emitDeleteSpy).not.toHaveBeenCalled();
        });
    });
  });
});
