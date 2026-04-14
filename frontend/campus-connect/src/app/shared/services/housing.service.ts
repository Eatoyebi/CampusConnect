@Injectable({ providedIn: 'root' })
export class HousingService {
  // Use 'api' for standalone data (Buildings/Floors/Rooms)
  private api = 'https://campusconnect-4jxl.onrender.com/api';
  
  // Use 'studentApi' for the assignment logic
  private studentApi = 'https://campusconnect-4jxl.onrender.com/api/students';

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
    return this.http.put(`${this.studentApi}/${studentUserId}/assign-room`, { roomId });
  }
}
