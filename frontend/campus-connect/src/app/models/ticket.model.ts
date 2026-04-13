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

    emegerncy: boolean;

    assignedTo?:{
    _id: string;
    name: string;

    } 
    createdAt: Date;
    updatedAt: Date;
}