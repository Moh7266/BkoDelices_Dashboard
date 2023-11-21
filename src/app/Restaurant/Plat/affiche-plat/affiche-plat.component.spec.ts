import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffichePlatComponent } from './affiche-plat.component';

describe('AffichePlatComponent', () => {
  let component: AffichePlatComponent;
  let fixture: ComponentFixture<AffichePlatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffichePlatComponent]
    });
    fixture = TestBed.createComponent(AffichePlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
