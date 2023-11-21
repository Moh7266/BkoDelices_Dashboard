import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutRestaurantComponent } from './ajout-restaurant.component';

describe('AjoutRestaurantComponent', () => {
  let component: AjoutRestaurantComponent;
  let fixture: ComponentFixture<AjoutRestaurantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutRestaurantComponent]
    });
    fixture = TestBed.createComponent(AjoutRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
