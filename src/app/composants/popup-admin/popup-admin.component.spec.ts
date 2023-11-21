import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAdminComponent } from './popup-admin.component';

describe('PopupAdminComponent', () => {
  let component: PopupAdminComponent;
  let fixture: ComponentFixture<PopupAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupAdminComponent]
    });
    fixture = TestBed.createComponent(PopupAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
