import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Order, SortBy } from '@datorama/akita';
import { faCog, faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';
import { DateFilterValue } from 'src/app/shared/filter-popup/filter-popup.component';

import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { MapQuery } from '../encounter-play/map/state/map.query';
import { MapService } from '../encounter-play/map/state/map.service';
import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';

@Component({
  selector: 'app-encounters-list',
  templateUrl: './encounters-list.component.html',
  styleUrls: ['./encounters-list.component.scss']
})
export class EncountersListComponent implements OnInit {
  deleteIcon = faTimes;
  playIcon = faPlay;
  editIcon = faCog;

  encountersLoading$: Observable<boolean>;
  encounters$: Observable<Encounter[]>;

  sortBy: SortBy<Encounter, any> = 'lastModifiedDate';
  sortByOrder = Order.DESC;

  nameFilter: string;
  createdDatesFilter: DateFilterValue;
  modifiedDatesFilter: DateFilterValue;

  constructor(private encounterQuery: EncounterQuery,
              private encounterService: EncounterService,
              private encounterParticipantQuery: EncounterParticipantQuery,
              private encounterParticipantService: EncounterParticipantService,
              private participantTemplateQuery: ParticipantQuery,
              private mapQuery: MapQuery,
              private mapService: MapService,
              private storage: AngularFireStorage,
              private authService: AuthService) { }

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

  onDeleteEncounter(encounter: Encounter) {
    if (confirm('Delete encounter?')) {
      if (encounter.participantIds && encounter.participantIds.length > 0) {

        // 1. delete participant avatars from storage

        // get deleted encounter participants with avatars
        const participants = this.encounterParticipantQuery.getAll({filterBy: item =>
          encounter.participantIds.includes(item.id) && item.avatarUrl != null
        });

        if (participants && participants.length > 0) {
          let avatarUrls = Array.from(new Set(participants.map(item => item.avatarUrl)));

          if (avatarUrls.length > 0) {
            // filter out avatars used by existing participant templates
            const participantTemplates = this.participantTemplateQuery.getAll({filterBy: item =>
              avatarUrls.includes(item.avatarUrl)
            });

            if (participantTemplates && participantTemplates.length > 0) {
              avatarUrls = avatarUrls.filter(avatarUrl =>
                participantTemplates.findIndex(item =>
                  item.avatarUrl === avatarUrl
                ) < 0
              );
            }

            if (avatarUrls.length > 0) {

              // filter out avatars used by participants of other encounters
              const encounterParticipants = this.encounterParticipantQuery.getAll({filterBy: item =>
                item.avatarUrl && avatarUrls.includes(item.avatarUrl)
              });

              if (encounterParticipants && encounterParticipants.length > 0) {
                avatarUrls = avatarUrls.filter(avatarUrl =>
                  encounterParticipants.findIndex(item =>
                    item.avatarUrl === avatarUrl
                  ) < 0
                );
              }

              if (avatarUrls.length > 0) {
                // if anything left delete them

                for (const avatarUrl of avatarUrls) {
                  this.storage.storage.refFromURL(avatarUrl).delete();
                }
              }
            }
          }
        }

        // 2. delete participants from db
        this.encounterParticipantService.remove(encounter.participantIds);
      }

      if (encounter.mapId) {
        // 3. delete map img from storage

        const map = this.mapQuery.getEntity(encounter.mapId);
        if (map.mapUrl) {
          this.storage.storage.refFromURL(map.mapUrl).delete();
        }

        // 4. delete map from db
        this.mapService.remove(encounter.mapId);
      }


      // 5. Delete encounter from db
      this.encounterService.remove(encounter.id);
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
    if (this.authService.user.uid !== encounter.owner) {
      return false;
    }

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
