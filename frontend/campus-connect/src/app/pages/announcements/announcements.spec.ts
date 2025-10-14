import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Announcements } from './announcements';

describe('Announcements', () => {
  let component: Announcements;
  let fixture: ComponentFixture<Announcements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Announcements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Announcements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
