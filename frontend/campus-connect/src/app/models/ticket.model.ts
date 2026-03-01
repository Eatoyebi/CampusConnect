export type Status = 
| 'Pending'
| 'Assigned'
| 'In Progress'
| 'Completed'
| 'Closed';

export interface Ticket {
    _id: string;
    description: string;

    buildingId: string;
    floorId: string;
    roomId: string;

    status: Status;
    priority: 'Low' | 'Medium' | "High";

    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}