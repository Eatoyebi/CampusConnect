import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../shared/services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css'],
})
export class TicketList implements OnInit {

tickets: any[] = [];
searchText = '';
statusFilter = '';

constructor(private ticketService: TicketService) {}

ngOnInit() {
  this.loadTickets();
}

loadTickets() {
  this.ticketService.getAllTickets().subscribe((data: any[]) => {
    this.tickets = data;
  });
}

filteredTickets() {
  return this.tickets.filter(t =>
    t.description.toLowerCase().includes(this.searchText.toLowerCase()) &&
    (!this.statusFilter || t.status === this.statusFilter)
  );
}

}
