import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceTicketList } from './maintenance-ticket-list';

describe('MaintenanceTicketList', () => {
  let component: MaintenanceTicketList;
  let fixture: ComponentFixture<MaintenanceTicketList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceTicketList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceTicketList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
