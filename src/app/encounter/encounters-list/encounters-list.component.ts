import { Component, OnInit } from '@angular/core';
import { EncounterQuery } from '../state/encounter.query';
import { Observable } from 'rxjs';
import { Encounter } from '../state/encounter.model';
import { faSortAlphaDown, faSortAlphaDownAlt, faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-encounters-list',
  templateUrl: './encounters-list.component.html',
  styleUrls: ['./encounters-list.component.scss']
})
export class EncountersListComponent implements OnInit {
  sortAscIcon = faSortAlphaDown;
  sortDescIcon = faSortAlphaDownAlt;
  filterIcon = faFilter;

  encountersLoaded$: Observable<boolean>;
  encounters$: Observable<Encounter[]>;

  constructor(private encounterQuery: EncounterQuery) { }

  ngOnInit() {
  }

}
