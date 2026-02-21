import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

ngOnInit() {
  this.loadTickets();
}

loadTickets() {
  this.ticketService.getTickets().subscribe(data => {
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
