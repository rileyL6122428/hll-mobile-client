import { TestBed } from '@angular/core/testing';
import { AuthService, AuthServiceConfig, AUTH_SERVICE_CONFIG_TOKEN } from './auth.service';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

const config: AuthServiceConfig = {
  authorizationUrl: 'EXAMPLE_AUTHORIZATION_URL'
};

describe('AuthService', () => {

  let auth: AuthService;
  let safariViewController: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: AUTH_SERVICE_CONFIG_TOKEN,
          useValue: config
        },
        {
          provide: SafariViewController,
          useValue: jasmine.createSpyObj('safariViewController', [
            'isAvailable',
            'show',
            'hide'
          ])
        }
      ]
    });

    auth = TestBed.get(AuthService);
    safariViewController = TestBed.get(SafariViewController);
  });

  it('should be created', () => {
    expect(auth).toBeTruthy();
  });

  describe('#authorize', () => {
    let availabilityResolver;

    beforeEach(() => {
      (window as any).handleOpenURL = undefined;
      safariViewController
        .isAvailable.and.returnValue(new Promise((resolve) => {
          availabilityResolver = resolve;
        }));
    });

    it('sets a handleOpenURL listener on the window', () => {
      auth.authorize().subscribe();
      expect((window as any).handleOpenURL).toBeDefined();
    });

    it('directs the user\'s browser to the login location when safariBrowser is available', (done) => {
      auth.authorize().subscribe();
      setTimeout(() => {
        availabilityResolver(true);
      }, 5);
      setTimeout(() => {
        expect(safariViewController.show).toHaveBeenCalledWith({
          url: 'EXAMPLE_AUTHORIZATION_URL',
          hidden: false,
          animated: true,
          transition: 'curl',
          enterReaderModeIfAvailable: true,
          tintColor: '#ff0000'
        });
        done();
      }, 10);
    });

    afterEach(() => {
      (window as any).handleOpenURL = undefined;
    });
  });
});
