import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { TrackHttpClient } from 'hll-shared-client';
import { MockComponent } from 'ng-mocks';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrackListComponent } from '../shared/components/track-list/track-list.component';
import { Track } from '../shared/components/track-list/track.model';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  let alertControllerMock: { create: jasmine.Spy };
  let alertPromise: Promise<any>;
  let alertPromiseControls: {
    resolve: (val: any) => void,
    reject: (val: any) => void
  };

  let trackClientMock: { getTracks: jasmine.Spy };
  let getTracksObserver: Observer<Track[]>;

  let fetchedTracks: Track[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfilePage,
        MockComponent(TrackListComponent)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: TrackHttpClient,
          useValue: jasmine.createSpyObj('TrackClient', ['getTracks'])
        },
        {
          provide: AlertController,
          useValue: jasmine.createSpyObj('AlertController', ['create'])
        },
      ]
    })
    .compileComponents();

    _stubTrackClient();
    _stubAlertController();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    fetchedTracks = [
      {
        name: 'EXAMPLE_TRACK_1',
        id: 'EXAMPLE_TRACK_ID_1',
        duration: 1,
        s3Key: 'EXAMPLE_S3_KEY_1',
        userId: 'EXAMPLE_USER_ID_1'
      },
      {
        name: 'EXAMPLE_TRACK_2',
        id: 'EXAMPLE_TRACK_ID_2',
        duration: 2,
        s3Key: 'EXAMPLE_S3_KEY_2',
        userId: 'EXAMPLE_USER_ID_2'
      }
    ];

    environment.minGetTracksDelay = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('renders a list of null tracks by default', () => {
      const trackListComponent = _getTrackListComponent();
      expect(trackListComponent.tracks)
        .toEqual([null, null, null, null, null]);
    });

    it('fetches the user\'s tracks on load', () => {
      expect(trackClientMock.getTracks).toHaveBeenCalledWith({
        userId: 'rileylittlefield@ymail.com'
      });
    });

    it('renders tracks in tracklist when tracks call completes', (done) => {
      getTracksObserver.next(fetchedTracks);
      fixture.detectChanges();

      setTimeout(() => {
        fixture.detectChanges();
        const tracks = _getTrackListComponent().tracks;
        expect(tracks.length).toEqual(2);
        expect(tracks[0]).toBe(fetchedTracks[0]);
        expect(tracks[1]).toBe(fetchedTracks[1]);
        done();
      }, environment.minGetTracksDelay + 1);
    });
  });

  describe('Track Deletion', () => {
    it('renders a modal with appropriate config when a delete track event is emitted', () => {
      const secondTrack = fetchedTracks[1];
      _getTrackListComponent().delete.emit(secondTrack);
      fixture.detectChanges();

      expect(alertControllerMock.create).toHaveBeenCalled();
      const [alertConfig] = alertControllerMock.create.calls.first().args;
      expect(alertConfig.header)
        .toEqual(`Are you sure you want to delete ${secondTrack.name}?`);
      expect(alertConfig.message)
        .toEqual(`This decision cannot be reversed.`);
      expect(alertConfig.buttons.length).toBe(2);
      expect(alertConfig.buttons[0].text).toEqual('Cancel');
      expect(alertConfig.buttons[1].text).toEqual('Delete');
    });

    it('presents "delete track" modal after it is configured', (done) => {
      const secondTrack = fetchedTracks[1];
      _getTrackListComponent().delete.emit(secondTrack);
      fixture.detectChanges();

      const alert = jasmine.createSpyObj('alert', ['present']);
      alertPromiseControls.resolve(alert);
      alertPromise.then(() => {
        expect(alert.present).toHaveBeenCalled();
        done();
      });
    });

    xit('closes modal when cancel button is clicked');
    xit('deletes track when Delete button is clicked');
  });

  function _stubTrackClient() {
    trackClientMock = TestBed.get(TrackHttpClient);
    trackClientMock.getTracks.and.returnValue(new Observable(
      observer => getTracksObserver = observer
    ));
  }

  function _stubAlertController() {
    alertControllerMock = TestBed.get(AlertController);
    alertPromise = new Promise((resolve, reject) => {
      alertPromiseControls = { resolve, reject };
    });
    alertControllerMock.create.and.returnValue(alertPromise);
    // alertControllerMock.create.and.returnValue(new Promise((resolve, reject) => {
    //   alertPromise = { resolve, reject };
    // }));
  }

  function _getTrackListComponent(): TrackListComponent {
    return fixture
      .debugElement
      .query(By.css('hll-track-list'))
      .componentInstance as TrackListComponent;
  }
});
