import { Component, OnInit, Input } from '@angular/core';
import { Participant, ParticipantType } from '../../state/participants/participant.model';
import { Observable } from 'rxjs';
import { ParticipantQuery } from '../../state/participants/participant.query';
import { ParticipantService } from '../../state/participants/participant.service';
import { DamageTypeQuery } from '../../state/damage-type/damage-type.query';
import { DamageType } from '../../state/damage-type/damage-type.model';
import { SortBy, Order } from '@datorama/akita';
import { faSortAlphaUpAlt, faSortAlphaDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/state/auth.service';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss']
})
export class ParticipantsListComponent implements OnInit {
  sortAscIcon = faSortAlphaDown;
  sortDescIcon = faSortAlphaUpAlt;

  @Input() participantType: ParticipantType = null;

  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;

  allParticipants$: Observable<Participant[]>;
  allDamageTypes$: Observable<DamageType[]>;

  sortBy: SortBy<Participant, any> = 'name';
  sortByOrder = Order.ASC;

  nameFilter: string;
  typeFilter: ParticipantType[] = null;

  constructor(private participantsQuery: ParticipantQuery,
              private partiicpantService: ParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.participantsLoading$ = this.participantsQuery.selectLoading();
    this.damageTypesLoading$ = this.damageTypesQuery.selectLoading();

    this.allDamageTypes$ = this.damageTypesQuery.selectAll({filterBy: item => item.owner === this.authService.user.uid});
    this.selectParticipants();
  }

  selectParticipants() {
    this.allParticipants$ = this.participantsQuery.selectAll({
      filterBy: participant => {
        if (participant.owner !== this.authService.user.uid) {
          return false;
        }

        if (this.nameFilter && this.nameFilter.length > 0) {
          if (!participant.name.toLowerCase().includes(this.nameFilter.toLowerCase())) {
            return false;
          }
        }

        if (this.participantType != null) {
          if (participant.type !== this.participantType) {
            return false;
          }
        } else {
          if (this.typeFilter && this.typeFilter.length > 0) {
            if (!this.typeFilter.includes(participant.type)) {
              return false;
            }
          }
        }
        return true;
      },
      sortBy: this.sortBy,
      sortByOrder: this.sortByOrder
    });
  }

  getDamageTypesByIds(damageTypes: DamageType[], damageTypeIds: string[]): DamageType[] {
    if (damageTypeIds == null) {
      return [];
    }
    return damageTypes.filter(item => damageTypeIds.includes(item.id));
  }

  changeSortOrder(sortBy: SortBy<Participant, any>, isAsc: boolean, event) {
    if (this.sortBy === sortBy &&
         ((isAsc && this.sortByOrder === Order.ASC) ||
          (!isAsc && this.sortByOrder === Order.DESC))
       ) {
      return;
    }

    this.sortBy = sortBy;
    this.sortByOrder = isAsc ? Order.ASC : Order.DESC;
    this.selectParticipants();
  }

  switchSortOrder(sortBy: SortBy<Participant, any>) {
    if (this.sortBy === sortBy) {
      this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.sortBy = sortBy;
      this.sortByOrder = Order.ASC;
    }
    this.selectParticipants();
  }

  sortByType(a: Participant, b: Participant): number {
    if (a.type !== b.type) {
      const result = a.type - b.type;
      return this.sortByOrder === Order.ASC ? result : -result;
    }

    return a.name.localeCompare(b.name);
  }

  isSortingByName() {
    return this.sortBy === 'name';
  }

  isSortingByType() {
    return this.sortBy === 'type';
  }

  isSortingByInitiativeModifier() {
    return this.sortBy === 'initiativeModifier';
  }

  isSortingByHp() {
    return this.sortBy === 'maxHp';
  }

  isSortingByArmorClass() {
    return this.sortBy === 'armorClass';
  }

  isSortingBySpeed() {
    return this.sortBy === 'speed';
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  onNameFilterChanged(nameFilter) {
    this.nameFilter = nameFilter;
    this.selectParticipants();
  }

  onTypeFilterChanged(typeFilter: any[]) {
    this.typeFilter = [...typeFilter].map(el => el.value);
    this.selectParticipants();
  }

  onDeleteParticipant(id: string) {
    if (confirm('Delete participant?')) {
      this.partiicpantService.remove(id);
    }
  }
}
