import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { firestore } from 'firebase';

import { Tournament, TournamentData } from '../tournament';
import { RaspberryPiService } from '../../raspberry-pi/raspberry-pi.service';
import { TournamentService } from '../tournament.service';
import Timestamp = firestore.Timestamp;


@Component({
  selector: 'app-edit-tournament-dialog',
  templateUrl: './tournament-edit.component.html',
  styleUrls: ['./tournament-edit.component.css']
})
export class TournamentEditComponent implements OnInit {

  isUpdate = false;

  isLinear = false;
  firstStepGroup = this.fb.group({
    name: [null, Validators.required],
    date: [null, Validators.required],
  });
  secondStepGroup = this.fb.group({
    raspberryPis: this.fb.array([])
  });
  thirdStepGroup = this.fb.group({
    masterPi: [null, Validators.required]
  });

  allChecked = false;

  constructor(public dialogRef: MatDialogRef<TournamentEditComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: Tournament,
              private fb: FormBuilder,
              private tournamentService: TournamentService,
              private raspberryPiService: RaspberryPiService) {}

  ngOnInit(): void {
    if (this.dialogData !== null) {
      const tournamentData = this.dialogData.data;

      this.firstStepGroup.get('name').setValue(tournamentData.name);
      this.firstStepGroup.get('date').setValue(tournamentData.date.toDate());
      this.thirdStepGroup.get('masterPi').setValue(tournamentData.assignedRaspberryPis.find(pi => pi.role === 'master')?.id);

      this.isUpdate = true;
    }

    this.raspberryPiService.findAllByOwner().subscribe(raspberryPis =>
      raspberryPis.forEach(it => {
        const checked = this.dialogData?.data.assignedRaspberryPis.some(assignedPi => assignedPi.id === it.id) ?? false;
        const formGroup = this.fb.group({ id: it.id, name: it.data.name, checked });
        this.raspberryPis.push(formGroup);
      })
    );
  }

  get raspberryPis(): FormArray {
    return this.secondStepGroup.get('raspberryPis') as FormArray;
  }

  get selectedRaspberryPis(): AbstractControl[] {
    return this.raspberryPis.controls.filter(ctrl => ctrl.get('checked').value);
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
    const masterPiId = this.thirdStepGroup.get('masterPi').value as string;
    const slavePiIds = this.selectedRaspberryPis
      .map(ctrl => ctrl.get('id').value as string)
      .filter(id => id !== masterPiId);

    if (this.isUpdate) {
      const result = this.dialogData;
      const data = this.dialogData.data;

      data.name = this.firstStepGroup.get('name').value;
      data.date = Timestamp.fromDate(this.firstStepGroup.get('date').value);
      data.assignedRaspberryPis.push({ id: masterPiId, role: 'master' });
      slavePiIds.forEach(id => data.assignedRaspberryPis.push({ id, role: 'slave' }));

      this.tournamentService.update(result).catch(err => console.error(err));
    } else {
      const result: TournamentData = {
        name: this.firstStepGroup.value.name,
        date: this.firstStepGroup.value.date,
        assignedRaspberryPis: [{ id: masterPiId, role: 'master' }]
      };
      slavePiIds.forEach(id => result.assignedRaspberryPis.push({ id, role: 'slave' }));

      this.tournamentService.create(result)
        .then(() => this.dialogRef.close())
        .catch(err => console.error(err));
    }
  }
}
