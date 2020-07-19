import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { merge, Observable, of as observableOf } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { Tournament } from './tournament';
import { TournamentService } from './tournament.service';

/**
 * Data source for the Tournament view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TournamentDataSource extends DataSource<Tournament> {
  data: Tournament[] = [];
  paginator: MatPaginator;
  sort: MatSort;

  constructor(private tournamentService: TournamentService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   *
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Tournament[]> {
    return this.tournamentService.findAllByOwner().pipe(
      flatMap(data => {
        this.data = data;

        const dataMutations = [
          observableOf(data),
          this.paginator.page,
          this.sort.sortChange
        ];

        return merge(...dataMutations).pipe(map(() => {
          return this.getPagedData(this.getSortedData([...data]));
        }));
      })
    );
  }

  /**
   * Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Tournament[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Tournament[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name':
          return compare(a.data.name, b.data.name, isAsc);
        case 'date':
          return compare(a.data.date.seconds, b.data.date.seconds, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
