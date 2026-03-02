import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Building { _id: string; name: string; universityId: string; }
export interface Floor { _id: string; buildingId: string; universityId?: string; number: number;   name?: string;  }
export interface Room { _id: string; floorId: string; roomNumber: string; buildingId?: any; }

@Injectable({ providedIn: 'root' })
export class HousingService {
  private api = 'http://localhost:5050/api';

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.api}/buildings`);
  }

  getFloors(buildingId: string): Observable<Floor[]> {
    return this.http.get<Floor[]>(`${this.api}/floors`, { params: { buildingId } });
  }

  getRooms(floorId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.api}/rooms`, { params: { floorId } });
  }

  assignRoom(studentUserId: string, roomId: string) {
    return this.http.put(`${this.api}/students/${studentUserId}/assign-room`, { roomId });
  }
}