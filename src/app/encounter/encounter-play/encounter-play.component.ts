import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, of, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';

@Component({
  selector: 'app-encounter-play',
  templateUrl: './encounter-play.component.html',
  styleUrls: ['./encounter-play.component.scss']
})
export class EncounterPlayComponent implements OnInit {
  activeParticpantIcon = faPlay;

  encountersLoading$: Observable<boolean>;
  participantTemplatesLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;

  allParticipants$: Observable<EncounterParticipant[]>;

  sub: Subscription;
  encounter: Encounter;

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private participantTemplateQuery: ParticipantQuery,
              private encounterParticipantsQuery: EncounterParticipantQuery,
              private encounterParticipantsService: EncounterParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private authService: AuthService,
              private messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.encountersLoading$ = this.encounterQuery.selectLoading();
    this.participantTemplatesLoading$ = this.participantTemplateQuery.selectLoading();
    this.participantsLoading$ = this.encounterParticipantsQuery.selectLoading();
    this.damageTypesLoading$ = this.damageTypesQuery.selectLoading();
    this.conditionsLoading$ = this.conditionsQuery.selectLoading();

    this.sub = this.route.params.subscribe(
      (params: Params) => {
        const encounterId = params.id;
        if (!encounterId) {
          this.router.navigate(['404']);
        }

        this.encounter = this.encounterQuery.getEntity(encounterId);
        if (!this.encounter || this.encounter.owner !== this.authService.user.uid) {
          this.router.navigate(['404']);
        }

        this.encounterQuery.selectEntity(encounterId).subscribe(value => this.encounter = value);

        this.allParticipants$ = this.encounterParticipantsQuery.selectAll({
          filterBy: item => {
            if (item.owner !== this.authService.user.uid) {
              return false;
            }

            if (this.encounter.participantIds) {
              if (this.encounter.participantIds.includes(item.id)) {
                return true;
              }
            }

            return false;
          },
          sortBy: (a, b) => (a.initiative + a.initiativeModifier) - (b.initiative + b.initiativeModifier)
        });
      }
    );
  }

  isActive(participant) {
    return participant.id === this.encounter.activeParticipantId;
  }

  getConditions(conditionIds: string[]) {
    if (!conditionIds || conditionIds.length === 0) {
      return of([]);
    }
    return this.conditionsQuery.selectAll({
      filterBy: item => conditionIds.includes(item.id),
      sortBy: 'name'
    });
  }

  getDamageTypes(damageTypeIds: string[]) {
    if (!damageTypeIds || damageTypeIds.length === 0) {
      return of([]);
    }
    return this.damageTypesQuery.selectAll({
      filterBy: item => damageTypeIds.includes(item.id),
      sortBy: 'name'
    });
  }

  nextMove() {
    const participants = this.encounterParticipantsQuery.getAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }

        if (this.encounter.participantIds) {
          if (this.encounter.participantIds.includes(item.id)) {
            return true;
          }
        }

        return false;
      },
      sortBy: (a, b) => (a.initiative + a.initiativeModifier) - (b.initiative + b.initiativeModifier)
    });

    let activeParticipantId = null;
    if (this.encounter.activeParticipantId == null) {
      activeParticipantId = participants[0].id;
    } else {
      const currentIndex = participants.findIndex(item => item.id === this.encounter.activeParticipantId);
      if (currentIndex === -1) {
        console.log(':(');
      } else {
        const nextIndex = (currentIndex + 1) % participants.length;
        activeParticipantId = participants[nextIndex].id;
      }
    }

    this.encounterService.update({...this.encounter, activeParticipantId});
  }

  changeHp(participant: EncounterParticipant, dmgValue: number, heal: boolean) {
    if (dmgValue == null || dmgValue <= 0 ) {
      return;
    }

    let temp = participant.temporaryHp;
    let currentHp = participant.currentHp;

    if (!heal) {
      let remainingDmg = dmgValue;
      if (temp != null && temp > 0) {
        if (dmgValue > temp) {
          remainingDmg -= temp;
          temp = null;
        } else {
          temp -= remainingDmg;
          remainingDmg = 0;
        }
      }
      currentHp = Math.max(0, currentHp - remainingDmg);
    } else {
      currentHp = Math.min(participant.maxHp, currentHp + dmgValue);
    }

    this.encounterParticipantsService.update({ ...participant, currentHp, temporaryHp: temp });
  }

  changeTempHp(participant: EncounterParticipant, temporaryHp: number) {
    this.encounterParticipantsService.update({ ...participant, temporaryHp });
  }

  changeCurrentHp(participant: EncounterParticipant, currentHp: number) {
    this.encounterParticipantsService.update({ ...participant, currentHp });
  }

  changeMaxHp(participant: EncounterParticipant, maxHp: number) {
    this.encounterParticipantsService.update({ ...participant, maxHp });
  }

  changeAdvantages(participant: EncounterParticipant, advantages: string) {
    this.encounterParticipantsService.update({ ...participant, advantages });
  }

  changeComments(participant: EncounterParticipant, comments: string) {
    this.encounterParticipantsService.update({ ...participant, comments });
  }
}
