import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { RaspberryPi } from './raspberry-pi';
import { RaspberryPiService } from './raspberry-pi.service';
import { RaspberryPiDataSource } from './raspberry-pi-datasource';
import { RaspberryPiEditComponent } from './raspberry-pi-edit/raspberry-pi-edit.component';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-rpi',
  templateUrl: './raspberry-pi.component.html',
  styleUrls: ['./raspberry-pi.component.css']
})
export class RaspberryPiComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<RaspberryPi>;

  dataSource: RaspberryPiDataSource;
  displayedColumns = ['select', 'name', 'id'];
  selection = new SelectionModel<RaspberryPi>(true, []);

  constructor(
    public dialog: MatDialog,
    private raspberryPiService: RaspberryPiService
  ) {}

  ngOnInit(): void {
    this.dataSource = new RaspberryPiDataSource(this.raspberryPiService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openRegistrationDialog(): void {
    this.dialog.open(RegistrationComponent, { width: '500px' });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(RaspberryPiEditComponent, {
      width: '500px',
      data: this.selection.selected[0] // TODO temp; inline edit button
    });

    dialogRef.afterClosed().subscribe({
      complete: () => { this.selection.clear(); }
    });
  }

  unregisterSelected() {
    this.selection.selected.forEach(tournament =>
      this.raspberryPiService.unregister(tournament.id)
        .then(() => this.selection.clear())
        .catch(err => console.error(err))
    );
  }

  /** Returns whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** Generates the label for the checkbox on [row]. */
  checkboxLabel(row?): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} ${row.name}`;
  }
}
