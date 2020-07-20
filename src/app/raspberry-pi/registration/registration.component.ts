import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import { RaspberryPiService } from '../raspberry-pi.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm = this.fb.group({
    id: [null, Validators.required],
    name: [null, Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<RegistrationComponent>,
              private fb: FormBuilder,
              private raspberryPiService: RaspberryPiService) { }

  ngOnInit(): void {}

  onSubmit(): void {
    const id = this.registrationForm.get('id').value;
    const name = this.registrationForm.get('name').value;

    this.raspberryPiService.register(id, name);
    this.dialogRef.close();
  }
}
