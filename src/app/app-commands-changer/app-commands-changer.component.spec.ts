import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCommandsChangerComponent } from './app-commands-changer.component';

describe('AppCommandsChangerComponent', () => {
  let component: AppCommandsChangerComponent;
  let fixture: ComponentFixture<AppCommandsChangerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCommandsChangerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCommandsChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
