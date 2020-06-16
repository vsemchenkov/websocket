import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCommandsLineComponent } from './app-commands-line.component';

describe('AppCommandsLineComponent', () => {
  let component: AppCommandsLineComponent;
  let fixture: ComponentFixture<AppCommandsLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCommandsLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCommandsLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
