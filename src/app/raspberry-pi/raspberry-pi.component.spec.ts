import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaspberryPiComponent } from './raspberry-pi.component';

describe('RpiComponent', () => {
  let component: RaspberryPiComponent;
  let fixture: ComponentFixture<RaspberryPiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspberryPiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaspberryPiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
