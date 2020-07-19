import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;

import { Tournament } from '../tournament';
import { RaspberryPiService } from '../../rpi/raspberry-pi.service';
import { TournamentService } from '../tournament.service';


@Component({
  selector: 'app-edit-tournament-dialog',
  templateUrl: './tournament-edit.component.html',
  styleUrls: ['./tournament-edit.component.css']
})
export class TournamentEditComponent implements OnInit {

  isUpdate = false;

  tournamentForm = this.fb.group({
    name: [null, Validators.required],
    date: [null, Validators.required],
    raspberryPis: this.fb.array([])
  });

  allChecked = false;

  constructor(public dialogRef: MatDialogRef<TournamentEditComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: Tournament,
              private fb: FormBuilder,
              private tournamentService: TournamentService,
              private raspberryPiService: RaspberryPiService) {}

  ngOnInit(): void {
    if (this.dialogData !== null) {
      this.isUpdate = true;
      this.tournamentForm.get('name').setValue(this.dialogData.data.name);
      this.tournamentForm.get('date').setValue(this.dialogData.data.date.toDate());
    }

    this.raspberryPiService.findAllByOwner().subscribe(raspberryPis =>
      raspberryPis.forEach(it => {
        const formGroup = this.fb.group({ id: it.id, name: it.name, checked: false });
        this.raspberryPis.push(formGroup);
      })
    );
  }

  get raspberryPis(): FormArray {
    return this.tournamentForm.get('raspberryPis') as FormArray;
  }

  updateAllChecked() {
    this.allChecked = this.raspberryPis.length !== 0 && this.raspberryPis.controls.every(it => it.value.checked);
  }

  someChecked(): boolean {
    if (this.raspberryPis.length === 0 || this.allChecked) {
      return false;
    }
    return this.raspberryPis.controls.filter(it => it.value.checked).length > 0;
  }

  setAll(checked: boolean) {
    this.allChecked = checked;

    if (this.raspberryPis.length === 0) {
      return;
    }

    this.raspberryPis.controls.forEach(it => {
      const value = it.value;
      value.checked = checked;
      it.setValue(value);
    });
  }

  onSubmit(): void {
    if (this.isUpdate) {
      this.dialogData.data.name = this.tournamentForm.get('name').value;
      this.dialogData.data.date = Timestamp.fromDate(this.tournamentForm.get('date').value);

      this.tournamentService.update(this.dialogData)
        .then(() => this.dialogRef.close())
        .catch(err => console.error(err));
    } else {
      const result = {
        name: this.tournamentForm.value.name,
        date: this.tournamentForm.value.date
      };

      this.tournamentService.create(result)
        .then(() => this.dialogRef.close())
        .catch(err => console.error(err));
    }
  }
}
