import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {RouterModule} from '@angular/router';
import { TicketService } from '../../shared/services/ticket.service';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './maintenance.html',
  styleUrls: ['./maintenance.css']
})
export class Maintenance {

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  newRequest = {
    description: '',
    location: '',
    category: '',
    priority: '',
    emergency: false
  };

 submitRequest(form: NgForm) {
  if (!form.valid) return;

  this.ticketService.createTicket(this.newRequest).subscribe({
    next: () => {
      alert('Maintenance request submitted successfully!');
      form.resetForm();
      // Navigate to ticket list so user sees the new ticket
      this.router.navigate(['/maintenance/ticket-list']);
    },
    error: (err) => {
      console.error('Error submitting request:', err);
      alert('Failed to submit request. Please try again.');
    }
  });
}
}