import { Component } from '@angular/core';
import {TicketService} from "../../..//shared/services/ticket.service"; 
import { Ticket } from "../../..//models/ticket.model";

@Component({
  selector: 'app-maintenance-ticket-list',
  imports: [],
  templateUrl: './maintenance-ticket-list.html',
  styleUrl: './maintenance-ticket-list.css',
})
export class MaintenanceTicketList {
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
