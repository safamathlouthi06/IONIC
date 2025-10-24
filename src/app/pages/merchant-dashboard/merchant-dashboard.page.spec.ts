import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MerchantDashboardPage } from './merchant-dashboard.page';

describe('MerchantDashboardPage', () => {
  let component: MerchantDashboardPage;
  let fixture: ComponentFixture<MerchantDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
