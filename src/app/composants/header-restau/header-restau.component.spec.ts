import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRestauComponent } from './header-restau.component';

describe('HeaderRestauComponent', () => {
  let component: HeaderRestauComponent;
  let fixture: ComponentFixture<HeaderRestauComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderRestauComponent]
    });
    fixture = TestBed.createComponent(HeaderRestauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
