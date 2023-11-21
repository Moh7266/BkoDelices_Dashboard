import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutAdminComponent } from './ajout-admin.component';

describe('AjoutAdminComponent', () => {
  let component: AjoutAdminComponent;
  let fixture: ComponentFixture<AjoutAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjoutAdminComponent]
    });
    fixture = TestBed.createComponent(AjoutAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
