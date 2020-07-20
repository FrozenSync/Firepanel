import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { RaspberryPi } from '../raspberry-pi';
import { RaspberryPiService } from '../raspberry-pi.service';

@Component({
  selector: 'app-raspberry-pi-edit',
  templateUrl: './raspberry-pi-edit.component.html',
  styleUrls: ['./raspberry-pi-edit.component.css']
})
export class RaspberryPiEditComponent implements OnInit {

  raspberryPiForm = this.fb.group({
    name: [null, Validators.required]
  });

  constructor(public dialogRef: MatDialogRef<RaspberryPiEditComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: RaspberryPi,
              private fb: FormBuilder,
              private raspberryPiService: RaspberryPiService) { }

  ngOnInit(): void {
    if (this.dialogData !== null) {
      this.raspberryPiForm.get('name').setValue(this.dialogData.data.name);
    }
  }

  onSubmit(): void {
    this.dialogData.data.name = this.raspberryPiForm.get('name').value;
    this.raspberryPiService.update(this.dialogData)
      .then(() => this.dialogRef.close())
      .catch(err => console.error(err));
  }
}
