import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { HomePage } from './home.page';
import { AppLogoComponent } from '../shared/app-logo/app-logo.component';
import { AuthService } from '../shared/auth/auth.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      declarations: [
        HomePage,
        MockComponent(AppLogoComponent)
      ],
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('authService', [''])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
