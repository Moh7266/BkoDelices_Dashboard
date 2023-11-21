import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficheTypeComponent } from './affiche-type.component';

describe('AfficheTypeComponent', () => {
  let component: AfficheTypeComponent;
  let fixture: ComponentFixture<AfficheTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AfficheTypeComponent]
    });
    fixture = TestBed.createComponent(AfficheTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
