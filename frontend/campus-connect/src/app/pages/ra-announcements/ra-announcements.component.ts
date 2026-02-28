import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { AnnouncementsApi } from '../announcements/announcements.api';

interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  category: string;
  createdAt: Date;
}

@Component({
  selector: 'app-ra-announcements',
  templateUrl: './ra-announcements.component.html',
  styleUrls: ['./ra-announcements.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  standalone: true
})
export class RaAnnouncements implements OnInit {
  categories = ['general', 'floor', 'building'];
  form: FormGroup;
  private _error = '';

  items: AnnouncementItem[] = [];

  constructor(private fb: FormBuilder, private api: AnnouncementsApi) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      category: [this.categories[0], Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements() {
    this.api.list().subscribe({
      next: (rows) => {
        this.items = rows.map((a: any) => ({
          id: a._id,
          title: a.title,
          message: a.body,
          category: (a.audience || 'general').toLowerCase(), // backend doesn't store category yet
          createdAt: new Date(a.createdAt)
        }));
      },
      error: (err) => {
        console.error(err);
        this._error = 'Failed to load announcements.';
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._error = 'Please fill out all fields correctly.';
      return;
    }

    this._error = '';

    const payload = {
      title: this.form.value.title,
      body: this.form.value.message,
      postedBy: 'RA',
      audience: 'All'
    };

    this.api.create(payload).subscribe({
      next: (saved) => {
        // show it immediately on screen
        this.items.unshift({
          id: saved._id,
          title: saved.title,
          message: saved.body,
          category: this.form.value.category,
          createdAt: new Date(saved.createdAt)
        });

        this.form.reset({ category: this.categories[0] });
      },
      error: (err) => {
        console.error(err);
        this._error = 'Failed to save announcement.';
      }
    });
  }
  
  delete(id: string) {
    if (!confirm("Delete this announcement?")) return;
  
    this.api.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter(a => a.id !== id);
      },
      error: (err) => {
        console.error(err);
        this._error = "Failed to delete announcement.";
      }
    });
  }
  

  error() {
    return this._error;
  }
}
