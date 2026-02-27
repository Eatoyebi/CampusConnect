export interface Ticket {
    _id: string;
    description: string;
    status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Closed';
    priority: 'Low' | 'Medium' | "High";
    assignedTo?: string;
    createdAt: Date;
    updatedAt: Date;
}