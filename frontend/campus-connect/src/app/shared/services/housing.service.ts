@Injectable({ providedIn: 'root' })
export class HousingService {
  private api = 'https://campusconnect-4jxl.onrender.com/api';
  
  private studentApi = 'https://campusconnect-4jxl.onrender.com/api/students';

  constructor(private http: HttpClient) {}

  getBuildings(): Observable<Building[]> {
    // Hits: /api/buildings
    return this.http.get<Building[]>(`${this.api}/buildings`);
  }

  getFloors(buildingId: string): Observable<Floor[]> {
    // Hits: /api/floors
    return this.http.get<Floor[]>(`${this.api}/floors`, { params: { buildingId } });
  }

  getRooms(floorId: string): Observable<Room[]> {
    // Hits: /api/rooms
    return this.http.get<Room[]>(`${this.api}/rooms`, { params: { floorId } });
  }

  assignRoom(studentUserId: string, roomId: string) {
    // Hits: /api/students/[ID]/assign-room
    return this.http.put(`${this.studentApi}/${studentUserId}/assign-room`, { roomId });
  }
}
