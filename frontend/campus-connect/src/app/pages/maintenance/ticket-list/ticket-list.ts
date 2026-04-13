import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TicketService } from '../../../shared/services/ticket.service';
import { Ticket } from '../../../models/ticket.model'


@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-list.html',
  styleUrls: ['./ticket-list.css'],
})
export class TicketList implements OnInit {

tickets: Ticket[] = [];
filteredTickets: Ticket[] = [];

searchText = '';
statusFilter = '';

constructor(private ticketService: TicketService) {}

ngOnInit() {
 this.loadTickets();
}

loadTickets(){
  this.ticketService.getMyTickets().subscribe(data =>{
    this.tickets = data;
    this.applyFilters();
  })
}

applyFilters() {
  this.filteredTickets = this.tickets.filter(t => {

    const matchSearch = !this.searchText || t.description.toLowerCase().includes(this.searchText.toLowerCase());

    const matchStatus = !this.statusFilter || t.status === this.statusFilter


    return matchSearch && matchStatus;
  });
}

getStatusCount(status?: string): number {
  if(!status) return this.tickets.length;
  return this.tickets.filter(t => t.status === status).length;
}

}