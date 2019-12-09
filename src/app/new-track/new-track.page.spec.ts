import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrackPage } from './new-track.page';

describe('NewTrackPage', () => {
  let component: NewTrackPage;
  let fixture: ComponentFixture<NewTrackPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTrackPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
});
