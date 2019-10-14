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
    let browserAvailabilityResolver;
    let successUrl;
    let failureUrl;

    beforeEach(() => {
      (window as any).handleOpenURL = undefined;
      safariViewController
        .isAvailable.and.returnValue(new Promise((resolve) => {
          browserAvailabilityResolver = resolve;
        }));

      successUrl = 'mycoolapp://callback' +
        '#access_token=EXAMPLE_ACCESS_TOKEN' +
        '&expires_in=EXAMPLE_EXPIRES_IN' +
        '&token_type=Bearer' +
        '&state=EXAMPLE_STATE' +
        '&id_token=EXAMPLE_ID_TOKEN';

      failureUrl = 'mycoolapp://callback' +
        '#error=true' +
        'errorMessage="Auth service denied the request"' +
        '&state=EXAMPLE_STATE';
    });

    it('sets a handleOpenURL listener on the window', () => {
      auth.authorize().subscribe();
      expect((window as any).handleOpenURL).toBeDefined();
    });

    it('directs the user\'s browser to the login location when safariBrowser is available', (done) => {
      auth.authorize().subscribe();
      browserAvailabilityResolver(true);

      const shortWait = 1;
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
      }, shortWait);
    });

    it('emits true when url passed to handleOpenURL listener contains an id_token', (done) => {
      auth.authorize().subscribe((result: boolean) => {
        expect(result).toBe(true);
        done();
      });
      _getHandleOpenURLCallback()(successUrl);
    });

    it('emits false when url passed to handleOpenURL listener contains an id_token', (done) => {
      auth.authorize().subscribe((result: boolean) => {
        expect(result).toBe(false);
        done();
      });
      _getHandleOpenURLCallback()(failureUrl);
    });

    it('saves the id_token when url passed to handleOpenURL listener contains an id_token', (done) => {
      auth.authorize().subscribe(() => {
        expect(auth.idToken).toEqual('EXAMPLE_ID_TOKEN');
        done();
      });
      _getHandleOpenURLCallback()(successUrl);
    });

    afterEach(() => {
      (window as any).handleOpenURL = undefined;
    });
  });

  function _getHandleOpenURLCallback(): (url: string) => void {
    return (window as any).handleOpenURL;
  }
});
