import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketList } from './ticket-list';

describe('TicketList', () => {
  let component: TicketList;
  let fixture: ComponentFixture<TicketList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
