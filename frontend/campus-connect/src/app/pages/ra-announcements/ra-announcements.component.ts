import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule } from '@angular/forms';
import { AnnouncementsService, Announcement } from './announcements.service';

@Component({
  selector: 'app-ra-announcements',
  templateUrl: './ra-announcements.component.html',
  styleUrls: ['./ra-announcements.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule,],
  standalone: true
})
export class RaAnnouncements {
  categories = ['general', 'floor', 'building'];
  form: FormGroup;
  private _error = '';

  constructor(private fb: FormBuilder, private announcementsService: AnnouncementsService) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      category: [this.categories[0], Validators.required],
      message: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._error = 'Please fill out all fields correctly.';
      return;
    }
    const announcement: Announcement = {
      id: Date.now(),
      title: this.form.value.title,
      message: this.form.value.message,
      category: this.form.value.category,
      createdAt: new Date()
    };
    this.announcementsService.addAnnouncement(announcement);
    this.form.reset({category: this.categories[0]});
    this._error = '';
  }

  error() {
    return this._error;
  }
}
