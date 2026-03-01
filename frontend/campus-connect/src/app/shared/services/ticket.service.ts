import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';

@Injectable({
    providedIn: 'root'
})

export class TicketService {
    private baseUrl = '/api/maintenance';

    constructor(private http: HttpClient) {}

    createTicket(formData: FormData): Observable<any> {
        return this.http.post(this.baseUrl, formData);
    }

    // read ticket functions
    getAllTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.baseUrl);
    }

    getMyTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/my-tickets`);
    }

    getAssignedTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/assigned-tickets`);
    }

    getUnassignedTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/unassigned-tickets`);
    }

    getAllResidentTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/all-tickets`);
    }

    getTicketById(id: string): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
    }

    // update ticket functions
    assignTicket(ticketId: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${ticketId}/assign`, {})
    }

    updateTicketStatus(ticketId: string, status: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${ticketId}/status`, { status });
    }

    addNote(ticketId: string, text: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${ticketId}/notes`, { text });
    }

    // delete ticket functions
    deleteTicket(ticketId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${ticketId}`);
    }
    }
