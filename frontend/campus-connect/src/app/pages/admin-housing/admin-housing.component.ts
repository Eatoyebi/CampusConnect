import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of } from "rxjs";

import { HousingService, Building, Floor, Room } from "../../shared/services/housing.service";
import { UserService, User } from "../../shared/services/user.service";

@Component({
  selector: "app-admin-housing",
  standalone: true,
  templateUrl: "./admin-housing.component.html",
  styleUrls: ["./admin-housing.component.css"],
  imports: [CommonModule, FormsModule],
})
export class AdminHousingComponent implements OnInit, OnDestroy {
  buildings: Building[] = [];
  floors: Floor[] = [];
  rooms: Room[] = [];

  selectedBuildingId = "";
  selectedFloorId = "";
  selectedRoomId = "";
  showResults = false;

  search = "";
  students: User[] = [];
  selectedStudentId = "";
  selectedStudent: User | null = null;

  statusMsg = "";
  private search$ = new Subject<string>();
  private sub = new Subscription();

  constructor(
    private housingService: HousingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.housingService.getBuildings().subscribe({
      next: (b) => (this.buildings = b),
      error: (e) => console.error("Failed to load buildings", e),
    });

    // typeahead search pipeline
    this.sub.add(
      this.search$
        .pipe(
          debounceTime(250),
          distinctUntilChanged(),
          switchMap((q) => {
            const trimmed = q.trim();
            if (!trimmed) return of([]);
            return this.userService.searchUsers(trimmed);
          })
        )
        .subscribe({
            next: (users) => {
              this.students = users.filter((u) => u.role === "student");
              this.showResults = this.students.length > 0;
            },
            error: (e) => console.error("Search failed", e),
          })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onBuildingChange() {
    this.selectedFloorId = "";
    this.selectedRoomId = "";
    this.floors = [];
    this.rooms = [];

    if (!this.selectedBuildingId) return;

    this.housingService.getFloors(this.selectedBuildingId).subscribe({
      next: (floors) => (this.floors = floors),
      error: (err) => console.error("Failed to load floors", err),
    });
  }

  onFloorChange() {
    this.selectedRoomId = "";
    this.rooms = [];

    if (!this.selectedFloorId) return;

    this.housingService.getRooms(this.selectedFloorId).subscribe({
      next: (rooms) => (this.rooms = rooms),
      error: (err) => console.error("Failed to load rooms", err),
    });
  }

  searchStudents() {
    const trimmed = this.search.trim();
  
    // If they cleared the box, clear UI state too
    if (!trimmed) {
      this.students = [];
      this.selectedStudent = null;
      this.showResults = false;
      this.statusMsg = "";
      return;
    }
  
    this.showResults = true;
    this.search$.next(trimmed);
  }

  selectStudent(s: User) {
    this.selectedStudent = s;
    this.selectedStudentId = s._id;
    this.search = `${s.name} (${s.email})`;
    this.showResults = false;
    this.students = []; // optional, clears dropdown
    this.statusMsg = "";
  }
  
  onSearchBlur() {
    setTimeout(() => (this.showResults = false), 150);
  }


  assign() {
    this.statusMsg = "";
  
    if (!this.selectedStudentId || !this.selectedRoomId) return;
  
    this.housingService.assignRoom(this.selectedStudentId, this.selectedRoomId).subscribe({
      next: () => (this.statusMsg = "Room assigned successfully."),
      error: (err) => (this.statusMsg = err?.error?.message || "Failed to assign room."),
    });
  }
}