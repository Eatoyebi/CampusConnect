import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';


interface MaintenanceRequest {
    name: string;
    mNumber: string;
    location: string
    description: string;
    status: string; 
}
@Component({
  selector: 'app-maintenance',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css'
})


export class Maintenance {

    newRequest: MaintenanceRequest = { //object to hold new request data
    name: '',
    mNumber: '',
    location: '',
    description: '',
    status: 'Pending'
  }; 

  requests: MaintenanceRequest[] = []; //array of requests

submitRequest(form: NgForm) {
  //Logic to submit maintenance request
    if (form.valid)  //are all fields filled?
      { 
      this.newRequest.status = 'Pending'; //set status to pending when a new ticket is submitted
      this.requests.push({ ...this.newRequest }); //add new request to requests array
      this.newRequest = { 
        name: '', 
        mNumber: '', location: '', 
        description: '', 
        status: 'Pending'
      }; //reset form
      form.resetForm(); //reset form validation state
  }
  }
}
