import { Component, OnInit } from '@angular/core';
import { Order, SortBy } from '@datorama/akita';
import { faFilter, faSortAlphaDown, faSortAlphaDownAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';

@Component({
  selector: 'app-encounters-list',
  templateUrl: './encounters-list.component.html',
  styleUrls: ['./encounters-list.component.scss']
})
export class EncountersListComponent implements OnInit {
  sortAscIcon = faSortAlphaDown;
  sortDescIcon = faSortAlphaDownAlt;
  filterIcon = faFilter;

  encountersLoading$: Observable<boolean>;
  encounters$: Observable<Encounter[]>;

  sortBy: SortBy<Encounter, any> = 'lastModifiedDate';
  sortByOrder = Order.DESC;

  nameFilter: string;
  createdDatesFilter;
  modifiedDatesFilter;

  constructor(private encounterQuery: EncounterQuery,
              private encounterService: EncounterService) { }

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();

    this.encounters$ = this.encounterQuery.selectAll({sortBy: this.sortBy, sortByOrder: this.sortByOrder});
  }

  onDeleteEncounter(id: string) {
    if (confirm('Delete encounter?')) {
      this.encounterService.remove(id);
    }
  }

  changeSortOrder(sortBy: SortBy<Encounter, any>, isAsc: boolean) {
    if (this.sortBy === sortBy &&
         ((isAsc && this.sortByOrder === Order.ASC) ||
          (!isAsc && this.sortByOrder === Order.DESC))
       ) {
      return;
    }

    this.sortBy = sortBy;
    this.sortByOrder = isAsc ? Order.ASC : Order.DESC;
    this.encounters$ = this.encounterQuery.selectAll({sortBy: this.sortBy, sortByOrder: this.sortByOrder});
  }

  isSortingByName() {
    return this.sortBy === 'name';
  }

  isSortingByCreatedDate() {
    return this.sortBy === 'createdDate';
  }

  isSortingByModifiedDate() {
    return this.sortBy === 'lastModifiedDate';
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  onNameFilterChanged(event) {
    console.log(event);
  }

  onModifiedDateFilterChanged(event) {
    console.log(event);
  }

  onCreatedDateFilterChanged(event) {
    console.log(event);
  }

}
