import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../../models/ticket.model';

@Injectable({
    providedIn: 'root'
})

export class TicketService {
    private baseUrl = '/api/maintenance-tickets';

    constructor(private http: HttpClient) {}

    createTicket(data: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/create`, data, { withCredentials: true });
    }

    // read ticket functions
    getAllTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.baseUrl, { withCredentials: true });
    }

    getMyTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/my-tickets`, { withCredentials: true });
    }

    getAssignedTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/assigned-tickets`, { withCredentials: true });
    }

    getUnassignedTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/unassigned-tickets`, { withCredentials: true });
    }

    getAllResidentTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(`${this.baseUrl}/all-tickets`, { withCredentials: true });
    }

    getTicketById(id: string): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.baseUrl}/${id}`, { withCredentials: true });
    }

    // update ticket functions
    assignTicket(ticketId: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${ticketId}/assign`, {}, { withCredentials: true })
    }

    updateTicketStatus(ticketId: string, status: string): Observable<any> {
        return this.http.patch(`${this.baseUrl}/${ticketId}/status`, { status }, { withCredentials: true });
    }

    addNote(ticketId: string, text: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${ticketId}/notes`, { text }, { withCredentials: true });
    }

    // delete ticket functions
    deleteTicket(ticketId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${ticketId}`, { withCredentials: true });
    }
    }
