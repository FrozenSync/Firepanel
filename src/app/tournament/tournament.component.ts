import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';

import { Tournament } from './tournament';
import { TournamentService } from './tournament.service';
import { TournamentDataSource } from './tournament-datasource';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Tournament>;

  dataSource: TournamentDataSource;
  displayedColumns = ['select', 'name', 'date'];
  selection = new SelectionModel<Tournament>(true, []);

  constructor(private tournamentService: TournamentService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new TournamentDataSource(this.tournamentService);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openCreateDialog(): void {
    this.dialog.open(TournamentEditComponent, { width: '500px' });
  }

  openEditDialog(): void {
    const dialogRef = this.dialog.open(TournamentEditComponent, {
      width: '500px',
      data: this.selection.selected[0] // TODO temp; inline edit button
    });

    dialogRef.afterClosed().subscribe({
      complete: () => { this.selection.clear(); }
    });
  }

  deleteSelected() {
    this.selection.selected.forEach(tournament =>
      this.tournamentService.delete(tournament.id)
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
