import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css'
})
export class Maintenance {

    newRequest = {
    name: '',
    mNumber: '',
    location: '',
    description: ''
  }; //object to hold new request data

  requests: any[] = []; //array of requests

onSubmit() {
  //Logic to submit maintenance request
    if (this.newRequest.name && this.newRequest.mNumber && this.newRequest.location && this.newRequest.description) { //are all fields filled
      this.requests.push({ ...this.newRequest }); //add new request to requests array
      this.newRequest = { name: '', mNumber: '', location: '', description: '' }; //reset form
      alert('Maintenance request submitted successfully!');
  } else {
      alert('Please fill out all fields before pressing submit.');
  }
  }
}
