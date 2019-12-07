import { Component, OnInit } from '@angular/core';
import { Order, SortBy } from '@datorama/akita';
import { faFilter, faSortAlphaDown, faSortAlphaUpAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';
import { DateFilterValue } from 'src/app/shared/filter-popup/filter-popup.component';

@Component({
  selector: 'app-encounters-list',
  templateUrl: './encounters-list.component.html',
  styleUrls: ['./encounters-list.component.scss']
})
export class EncountersListComponent implements OnInit {
  sortAscIcon = faSortAlphaDown;
  sortDescIcon = faSortAlphaUpAlt;

  encountersLoading$: Observable<boolean>;
  encounters$: Observable<Encounter[]>;

  sortBy: SortBy<Encounter, any> = 'lastModifiedDate';
  sortByOrder = Order.DESC;

  nameFilter: string;
  createdDatesFilter: DateFilterValue;
  modifiedDatesFilter: DateFilterValue;

  constructor(private encounterQuery: EncounterQuery,
              private encounterService: EncounterService) { }

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();

    this.selectEncounters();
  }

  selectEncounters(): void {
    this.encounters$ = this.encounterQuery.selectAll({
      filterBy: this.checkFilter.bind(this),
      sortBy: this.sortBy,
      sortByOrder: this.sortByOrder
    });
  }

  onDeleteEncounter(id: string) {
    if (confirm('Delete encounter?')) {
      this.encounterService.remove(id);
    }
  }

  changeSortOrder(sortBy: SortBy<Encounter, any>, isAsc: boolean, event) {
    if (this.sortBy === sortBy &&
         ((isAsc && this.sortByOrder === Order.ASC) ||
          (!isAsc && this.sortByOrder === Order.DESC))
       ) {
      return;
    }

    this.sortBy = sortBy;
    this.sortByOrder = isAsc ? Order.ASC : Order.DESC;
    this.selectEncounters();
  }

  switchSortOrder(sortBy: SortBy<Encounter, any>) {
    if (this.sortBy === sortBy) {
      this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.sortBy = sortBy;
      this.sortByOrder = Order.ASC;
    }
    this.selectEncounters();
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

  onNameFilterChanged(nameFilter) {
    this.nameFilter = nameFilter;
    this.selectEncounters();
  }

  onModifiedDateFilterChanged(modifiedDatesFilter) {
    this.modifiedDatesFilter = modifiedDatesFilter;
    this.selectEncounters();
  }

  onCreatedDateFilterChanged(createdDatesFilter) {
    this.createdDatesFilter = createdDatesFilter;
    this.selectEncounters();
  }

  checkFilter(encounter: Encounter): boolean {
    if (!!this.nameFilter && this.nameFilter.length > 0 && !encounter.name.toLowerCase().includes(this.nameFilter.toLowerCase())) {
      return false;
    }

    if (!!this.modifiedDatesFilter) {
      const lastModifiedDate = new Date(encounter.lastModifiedDate);
      lastModifiedDate.setHours(0, 0, 0, 0);
      if (!!this.modifiedDatesFilter.minDate && this.modifiedDatesFilter.minDate.getTime() > lastModifiedDate.getTime()) {
        return false;
      }

      if (!!this.modifiedDatesFilter.maxDate && this.modifiedDatesFilter.maxDate.getTime() < lastModifiedDate.getTime()) {
        return false;
      }
    }

    if (!!this.createdDatesFilter) {
      const createdDate = new Date(encounter.createdDate);
      createdDate.setHours(0, 0, 0, 0);
      if (!!this.createdDatesFilter.minDate && this.createdDatesFilter.minDate.getTime() > createdDate.getTime()) {
        return false;
      }

      if (!!this.createdDatesFilter.maxDate && this.createdDatesFilter.maxDate.getTime() < createdDate.getTime()) {
        return false;
      }
    }

    return true;
  }

}
