import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { TrackHttpClient } from 'hll-shared-client';
import { MockComponent } from 'ng-mocks';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TrackListComponent } from '../shared/components/track-list/track-list.component';
import { Track } from '../shared/components/track-list/track.model';
import { ProfilePage } from './profile.page';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  let alertControllerMock: { create: jasmine.Spy };
  let alertPromise: Promise<any>;
  let alertPromiseControls: {
    resolve: (val: any) => void,
    reject: (val: any) => void
  };

  let actionSheetController: { create: jasmine.Spy };
  let actionSheet: { present: jasmine.Spy };

  let trackClientMock: { getTracks: jasmine.Spy, delete: jasmine.Spy };
  let getTracksObserver: Observer<Track[]>;

  let router: { navigate: jasmine.Spy };

  let auth: { idToken: string };

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
          useFactory: _stubTrackClient
        },
        {
          provide: AlertController,
          useValue: jasmine.createSpyObj('AlertController', ['create'])
        },
        {
          provide: Router,
          useFactory: _stubRouter
        },
        {
          provide: ActionSheetController,
          useFactory: _stubActionSheetController
        },
        {
          provide: AuthService,
          useFactory: _stubAuthService
        }
      ]
    })
    .compileComponents();

    _stubAlertController();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
  }));

  beforeEach(async(() => {
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

    environment.minGetTracksDelay = 1;

    component.ionViewWillEnter();
    fixture.detectChanges();

    getTracksObserver.next(fetchedTracks);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
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

    it('renders tracks in TrackListComponent when "fetch tracks" API call completes', (done) => {
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
    let secondTrack;

    beforeEach(() => {
      secondTrack = fetchedTracks[1];
      _getTrackListComponent().delete.emit(secondTrack);
      fixture.detectChanges();
    });

    it('renders a modal when a "delete track" event is emitted', () => {
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
      const alert = jasmine.createSpyObj('alert', ['present']);
      alertPromiseControls.resolve(alert);
      alertPromise.then(() => {
        expect(alert.present).toHaveBeenCalled();
        done();
      });
    });

    it('delegates track deletion to TrackHttpClient when Delete button is clicked', () => {
      _getDeleteButton().handler();
      expect(trackClientMock.delete).toHaveBeenCalledWith({
        track: secondTrack,
        bearerToken: auth.idToken
      });
    });

    it('removes deleted track from list provided to TrackListComponent', () => {
      _getDeleteButton().handler();
      fixture.detectChanges();

      const trackListComponent = _getTrackListComponent();
      expect(trackListComponent.tracks.length).toEqual(1);
      expect(trackListComponent.tracks[0]).not.toBe(secondTrack);
    });
  });

  describe('Action Button', () => {

    it('renders action list when clicked', () => {
      _getActionsButton().click();
      fixture.detectChanges();
      expect(actionSheetController.create).toHaveBeenCalled();
      const [actionSheetConfig] = actionSheetController.create.calls.first().args;
      expect(actionSheetConfig.buttons.length).toEqual(2);

      const actionSheetDelay = 3;
      setTimeout(() => {
        expect(actionSheet.present).toHaveBeenCalled();
      }, actionSheetDelay);
    });

    it('navigates to new track page when "Create new track" button is clicked', () => {
      _getActionsButton().click();
      fixture.detectChanges();

      const [actionSheetConfig] = actionSheetController.create.calls.first().args;
      const createNewTrackButton = actionSheetConfig
        .buttons
        .find((button) => button.text === 'Create new track');
      createNewTrackButton.handler();

      expect(router.navigate).toHaveBeenCalledWith(['/new-track']);
    });

    it('contains a "cancel" button', () => {
      _getActionsButton().click();
      fixture.detectChanges();

      const [actionSheetConfig] = actionSheetController.create.calls.first().args;
      const cancelButton = actionSheetConfig
        .buttons
        .find((button) => button.role === 'cancel');
      expect(cancelButton).toBeTruthy();
    });
  });

  function _getDeleteButton() {
    const [alertConfig] = alertControllerMock.create.calls.first().args;
    return alertConfig
      .buttons
      .find((button) => button.text === 'Delete');
  }

  function _stubTrackClient() {
    trackClientMock = jasmine.createSpyObj('TrackClient', ['getTracks', 'delete']);
    trackClientMock.getTracks.and.returnValue(new Observable(
      observer => getTracksObserver = observer
    ));

    trackClientMock.delete.and.returnValue(new Observable());

    return trackClientMock;
  }

  function _stubAuthService() {
    auth = { idToken: 'EXAMPLE_ID_TOKEN' };
    return auth;
  }

  function _stubAlertController() {
    alertControllerMock = TestBed.get(AlertController);
    alertPromise = new Promise((resolve, reject) => {
      alertPromiseControls = { resolve, reject };
    });
    alertControllerMock.create.and.returnValue(alertPromise);
  }

  function _getTrackListComponent(): TrackListComponent {
    return fixture
      .debugElement
      .query(By.css('hll-track-list'))
      .componentInstance as TrackListComponent;
  }

  function _stubRouter() {
    router = jasmine.createSpyObj('router', [
      'navigate'
    ]);
    return router;
  }

  function _getActionsButton(): HTMLElement {
    return fixture
      .nativeElement
      .querySelector('#actions-button');
  }

  function _stubActionSheetController() {
    actionSheetController = jasmine.createSpyObj('ActionSheetController', [
      'create'
    ]);

    actionSheet = jasmine.createSpyObj('actionSheet', [
      'present'
    ]);

    actionSheetController.create.and.returnValue(new Promise((resolve) => {
      resolve(actionSheet);
    }));

    return actionSheetController;
  }
});
