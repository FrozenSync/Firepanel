import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaspberryPiEditComponent } from './raspberry-pi-edit.component';

describe('RaspberryPiEditComponent', () => {
  let component: RaspberryPiEditComponent;
  let fixture: ComponentFixture<RaspberryPiEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspberryPiEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaspberryPiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
