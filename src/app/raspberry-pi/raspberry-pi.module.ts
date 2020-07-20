import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { RaspberryPiRoutingModule } from './raspberry-pi-routing.module';
import { RaspberryPiComponent } from './raspberry-pi.component';
import { RaspberryPiEditComponent } from './raspberry-pi-edit/raspberry-pi-edit.component';
import { RegistrationComponent } from './registration/registration.component';



@NgModule({
  declarations: [
    RaspberryPiComponent,
    RaspberryPiEditComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    RaspberryPiRoutingModule,
  ]
})
export class RaspberryPiModule { }
