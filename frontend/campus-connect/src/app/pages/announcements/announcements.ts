import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AnnouncementsApi } from "./announcements.api";

interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: Date;
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.html',
  styleUrls: ['./announcements.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class Announcements {
  categories = ['general', 'floor', 'building'];
  private _items: Announcement[] = [];
  form: FormGroup;
  private _error = '';

  constructor(private fb: FormBuilder,private api: AnnouncementsApi) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      category: [this.categories[0], Validators.required],
      message: ['', Validators.required]
    });

  }

  submit() {
    console.log("SUBMIT FIRED", this.form.value);
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._error = "Please fill out all fields correctly.";
      return;
    }
  
    const payload = {
      title: this.form.value.title,
      body: this.form.value.message,
      postedBy: "RA",
      audience: "All"
    };
  
    this.api.create(payload).subscribe({
      next: (saved) => {
        const mapped = {
          id: saved._id,
          title: saved.title,
          message: saved.body,
          category: this.form.value.category,
          createdAt: new Date(saved.createdAt)
        };
  
        this._items.unshift(mapped);
        this.form.reset({ category: this.categories[0] });
        this._error = "";
      },
      error: (err) => {
        console.error(err);
        this._error = "Failed to save announcement.";
      }
    });
  }  

  items() {
    return this._items;
  }

  count() {
    return this._items.length;
  }

  delete(id: string) {
    this._items = this._items.filter(a => a.id !== id);
  }

  error() {
    return this._error;
  }
}
