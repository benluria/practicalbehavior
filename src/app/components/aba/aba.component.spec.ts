import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbaComponent } from './aba.component';

describe('AbaComponent', () => {
  let component: AbaComponent;
  let fixture: ComponentFixture<AbaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
