import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TicketService {
    private baseUrl = '/api/tickets';

    constructor(private http: HttpClient) {}

    createTicket(formData: FormData): Observable<any> {
        return this.http.post(this.baseUrl, formData);
    }

    // read ticket functions
    getAll(): Observable<any[]> {
        return this.http.get<any[]>(this.baseUrl);
    }

    getMyTickets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/my-tickets`);
    }

    getAssignedTickets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/assigned-tickets`);
    }

    getUnassignedTickets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/unassigned-tickets`);
    }

    getAllResidentTickets(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/residents`);
    }

    getTicketById(id: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/${id}`);
    }

    // update ticket functions
    assignTicket(ticketId: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/${ticketId}/assign`, {})
    }

    updateTicketStatus(ticketId: string, status: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/${ticketId}/status`, { status });
    }

    addNote(ticketId: string, text: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/${ticketId}/notes`, { text });
    }

    // delete ticket functions
    deleteTicket(ticketId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${ticketId}`);
    }
    }
