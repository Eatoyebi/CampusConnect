import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Building { _id: string; name: string; universityId: string; }
export interface Floor { _id: string; buildingId: string; universityId?: string; number: number;   name?: string;  }
export interface Room { _id: string; floorId: string; roomNumber: string; buildingId?: any; }
export interface RaAssignment { _id: string;
  raId: any; floorId: any; active?: boolean; createdAt?: string; updatedAt?: string;}
@Injectable({ providedIn: 'root' })
export class HousingService {
  private api = 'http://localhost:5050/api';

  constructor(private http: HttpClient) {}

getBuildings(): Observable<Building[]> {
  return this.http.get<Building[]>(`${this.api}/buildings`, { withCredentials: true });
}

getFloors(buildingId: string): Observable<Floor[]> {
  return this.http.get<Floor[]>(`${this.api}/floors`, { params: { buildingId }, withCredentials: true,});
}

getRooms(floorId: string): Observable<Room[]> {
  return this.http.get<Room[]>(`${this.api}/rooms`, {  params: { floorId }, withCredentials: true,});
}

assignRoom(studentUserId: string, roomId: string) {
  return this.http.put( `${this.api}/students/${studentUserId}/assign-room`, { roomId }, { withCredentials: true });
}

getRaAssignments(floorId: string): Observable<RaAssignment[]> {
  return this.http.get<RaAssignment[]>(`${this.api}/ra-assignments`, {params: { floorId }, withCredentials: true, });
}

assignRaToFloor(raId: string, floorId: string): Observable<RaAssignment> {
  return this.http.post<RaAssignment>( `${this.api}/ra-assignments`, { raId, floorId },  { withCredentials: true } );
}

removeRaAssignment(assignmentId: string): Observable<{ message?: string } | any> {
  return this.http.delete(`${this.api}/ra-assignments/${assignmentId}`, {  withCredentials: true, });
}
}