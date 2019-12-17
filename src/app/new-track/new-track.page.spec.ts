import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewTrackPage } from './new-track.page';
import { LoadingController, ToastController, AlertController, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth/auth.service';
import { TrackHttpClient } from 'hll-shared-client';
import { Observer, Observable } from 'rxjs';
import { MockComponent } from 'ng-mocks';
import { environment } from 'src/environments/environment';

describe('NewTrackPage', () => {
  let component: NewTrackPage;
  let fixture: ComponentFixture<NewTrackPage>;

  let loadingController: { create: jasmine.Spy, dismiss: jasmine.Spy };
  let loader: { present: jasmine.Spy };

  let toastController: { create: jasmine.Spy };
  let toast: { present: jasmine.Spy };

  let alertController: { create: jasmine.Spy };
  let mobileAlert: { present: jasmine.Spy };

  let router: { navigate: jasmine.Spy };

  let auth: { idToken: string };

  let trackClient: { upload: jasmine.Spy };
  let uploadObserver: Observer<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NewTrackPage,
        MockComponent(IonInput)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: LoadingController,
          useFactory: _stubLoadingController
        },
        {
          provide: Router,
          useFactory: _stubRouter
        },
        {
          provide: AuthService,
          useFactory: _stubAuthService
        },
        {
          provide: ToastController,
          useFactory: _stubToastController
        },
        {
          provide: AlertController,
          useFactory: _stubAlertController
        },
        {
          provide: TrackHttpClient,
          useFactory: _stubTrackHttpClient
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTrackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {

    it('resets track name', () => {
      component.trackName = 'EXAMPLE_TRACK_NAME';
      fixture.detectChanges();

      component.ionViewWillEnter();
      fixture.detectChanges();

      expect(component.trackName).toEqual('');
    });

    // NOT SURE HOW TO IMPLEMENT THIS SPEC
    xit('resets track contents form field');
  });

  describe('submit', () => {
    let trackName: string;
    let trackContents: File;

    beforeEach(() => {
      environment.minUploadTrackDelay = 10;

      trackName = 'EXAMPLE_TRACK_NAME';
      component.trackName = trackName;

      trackContents = new File([], 'EXAMPLE_LOCAL_FILE_NAME');
      component.onFileChange(trackContents);

      _getSubmitButton().click();

      fixture.detectChanges();
    });

    it('renders a loading modal', (done) => {
      const shortDelay = 3;
      setTimeout(() => {
        expect(loader.present).toHaveBeenCalled();
        done();
      }, shortDelay);
    });

    it('delegates track upload to the track client', (done) => {
      const shortDelay = 3;
      setTimeout(() => {
        expect(trackClient.upload).toHaveBeenCalledWith({
          name: trackName,
          contents: trackContents,
          bearerToken: auth.idToken
        });
        done();
      }, shortDelay);
    });

    it('dismisses the loader when track is successfully uploaded', (done) => {

      const shortLoaderDelay = 3;
      setTimeout(() => {
        uploadObserver.next('EXAMPLE_UPLOAD_RETURN_VALUE');
      }, shortLoaderDelay);

      setTimeout(() => {
        expect(loadingController.dismiss).toHaveBeenCalled();
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay);
    });

    it('renders a toast message when track is successfully uploaded', (done) => {
      const shortLoaderDelay = 3;

      setTimeout(() => {
        uploadObserver.next('EXAMPLE_UPLOAD_RETURN_VALUE');
      }, shortLoaderDelay);

      setTimeout(() => {
        expect(toastController.create).toHaveBeenCalled();
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay + 1);
    });

    it('navigates to the profile page when track is successfully uploaded', (done) => {
      const shortLoaderDelay = 3;
      const shortToastCreationDelay = 3;

      setTimeout(() => {
        uploadObserver.next('EXAMPLE_UPLOAD_RETURN_VALUE');
      }, shortLoaderDelay);

      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay + shortToastCreationDelay + 1);
    });

    it('dismisses the loader when track upload fails', (done) => {
      const shortLoaderDelay = 3;

      setTimeout(() => {
        uploadObserver.error('EXAMPLE_UPLOAD_ERROR');
      }, shortLoaderDelay);

      setTimeout(() => {
        expect(loadingController.dismiss).toHaveBeenCalled();
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay + 1);
    });

    it('shows an alert when track upload fails', (done) => {
      const shortLoaderDelay = 3;
      const shortAlertCreationDelay = 3;

      setTimeout(() => {
        uploadObserver.error('EXAMPLE_UPLOAD_ERROR');
      }, shortLoaderDelay);

      setTimeout(() => {
        expect(alertController.create).toHaveBeenCalled();
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay + shortAlertCreationDelay + 1);
    });

    it('navigates to the profile page when failure alert is closed', (done) => {
      const shortLoaderDelay = 3;

      setTimeout(() => {
        uploadObserver.error('EXAMPLE_UPLOAD_ERROR');
      }, shortLoaderDelay);

      setTimeout(() => {
        const [ alertParams ] = alertController.create.calls.first().args;
        const cancelButtons = alertParams.buttons.filter((button) => button.role === 'cancel');
        expect(cancelButtons.length).toBe(1);
        cancelButtons[0].handler();
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
        done();
      }, shortLoaderDelay + environment.minUploadTrackDelay + 1);

    });
  });

  function _stubLoadingController(): any {
    loadingController = jasmine.createSpyObj('loadingController', [
      'create',
      'dismiss'
    ]);

    loader = jasmine.createSpyObj('loader', [
      'present'
    ]);

    loadingController.create.and.returnValue(new Promise((resolve) => {
      resolve(loader);
    }));

    return loadingController;
  }

  function _stubRouter(): any {
    router = jasmine.createSpyObj('router', [
      'navigate'
    ]);

    return router;
  }

  function _stubAuthService(): any {
    auth = { idToken: 'EXAMPLE_ID_TOKEN' };
    return auth;
  }

  function _stubToastController(): any {
    toastController = jasmine.createSpyObj('toastController', [
      'create'
    ]);

    toast = jasmine.createSpyObj('toast', [
      'present'
    ]);

    toastController.create.and.returnValue(new Promise((resolve) => {
      resolve(toast);
    }));

    return toastController;
  }

  function _stubAlertController(): any {
    alertController = jasmine.createSpyObj('AlertController', [
      'create'
    ]);

    mobileAlert = jasmine.createSpyObj('mobileAlert', [
      'present'
    ]);

    alertController.create.and.returnValue(new Promise((resolve) => {
      resolve(mobileAlert);
    }));

    return alertController;
  }

  function _stubTrackHttpClient(): any {
    trackClient = jasmine.createSpyObj('TrackClient', [
      'upload'
    ]);

    trackClient.upload.and.returnValue(new Observable(
      (observer) => uploadObserver = observer
    ));

    return trackClient;
  }

  function _getSubmitButton(): HTMLButtonElement {
    return fixture
      .nativeElement
      .querySelector('#submit-button');
  }
});
