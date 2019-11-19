import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { HomePage } from './home.page';
import { AppLogoComponent } from '../shared/app-logo/app-logo.component';
import { AuthService } from '../shared/auth/auth.service';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authService: any;
  let router: any;

  beforeEach(async(() => {
    environment.skipAuth = false;

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [
        HomePage,
        MockComponent(AppLogoComponent)
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('authService', ['authorize'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('router', ['navigate'])
        }
      ]
    }).compileComponents();

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    let authObserver: Observer<boolean>;

    beforeEach(() => {
      authService.authorize.and.returnValue(new Observable(
        (observer) => authObserver = observer
      ));

      const appLogo: HTMLElement = fixture.debugElement.nativeElement.querySelector('hll-app-logo');
      appLogo.click();
      fixture.detectChanges();
    });

    it('calls authService.authorize when app logo is clicked', () => {
      expect(authService.authorize).toHaveBeenCalled();
    });

    it('navigates to profile page when authorization is successful', () => {
      authObserver.next(true);
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('alerts the user when authorization is not successful', () => {
      const originalAlertFunction = window.alert;
      spyOn(window, 'alert');
      authObserver.next(false);
      expect(window.alert).toHaveBeenCalledWith('Login failed. Try logging in later.');
      window.alert = originalAlertFunction;
    });
  });
});
