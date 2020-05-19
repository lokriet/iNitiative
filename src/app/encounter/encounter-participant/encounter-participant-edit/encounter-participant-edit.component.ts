import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { faCheck, faChevronRight, faDiceD6, faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { Feature } from 'src/app/setup/state/features/feature.model';
import { compareFeatures, FeatureQuery } from 'src/app/setup/state/features/feature.query';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../state/encounter-participant.model';
import { EncounterParticipantQuery } from '../state/encounter-participant.query';

@Component({
  selector: 'app-encounter-participant-edit',
  templateUrl: './encounter-participant-edit.component.html',
  styleUrls: ['./encounter-participant-edit.component.scss'],
  animations: [
    trigger('collapse', [
      state('collapsed', style({ height: '0px', borderColor: 'transparent' })),
      state('expanded', style({ height: '*', borderColor: '*' })),
      transition('collapsed <=> expanded', [animate('200ms')])
    ])
  ]
})
export class EncounterParticipantEditComponent implements OnInit, OnDestroy {
  @Input() participant: EncounterParticipant;
  @Output() changesSaved = new EventEmitter<EncounterParticipant>();
  @Output() changesCancelled = new EventEmitter<null>();

  faRight = faChevronRight;
  deleteIcon = faTimes;
  d20Icon = faDiceD6;
  saveIcon = faCheck;
  cancelIcon = faUndoAlt;

  @Input() expanded = false;
  @Output() expandedChanged = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<null>();


  color: string;
  name: string;
  initiative: number;
  initiativeModifier: number;
  currentHp: number;
  maxHp: number;
  temporaryHp: number;
  armorClass: number;
  speed: number;
  swimSpeed: number;
  climbSpeed: number;
  flySpeed: number;
  vulnerabilities: string[];
  immunities: string[] = [];
  resistances: string[] = [];
  conditions: string[] = [];
  features: string[] = [];
  comments: string;

  mapSize = 1;
  avatarUrl: string = null;
  initialAvatarUrl: string = null;

  allDamageTypes$: Observable<DamageType[]>;
  allConditions$: Observable<Condition[]>;
  allFeatures$: Observable<Feature[]>;

  constructor(private damageTypeQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private featureQuery: FeatureQuery,
              private authService: AuthService,
              private participantQuery: ParticipantQuery,
              private encounterParticipantQuery: EncounterParticipantQuery,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.color = this.participant.color;
    this.avatarUrl = this.participant.avatarUrl || null;
    this.initialAvatarUrl = this.avatarUrl;
    this.name = this.participant.name;
    this.initiative = this.participant.initiative;
    this.initiativeModifier = this.participant.initiativeModifier;
    this.currentHp = this.participant.currentHp;
    this.maxHp = this.participant.maxHp;
    this.temporaryHp = this.participant.temporaryHp;
    this.armorClass = this.participant.armorClass;
    this.speed = this.participant.speed;
    this.swimSpeed = this.participant.swimSpeed;
    this.climbSpeed = this.participant.climbSpeed;
    this.flySpeed = this.participant.flySpeed;
    this.comments = this.participant.comments;
    this.mapSize = this.participant.mapSizeX || 1;

    if (this.participant.conditionIds) {
      this.conditions = [...this.participant.conditionIds];
    }
    if (this.participant.vulnerabilityIds) {
      this.vulnerabilities = [...this.participant.vulnerabilityIds];
    }
    if (this.participant.immunityIds) {
      this.immunities = [...this.participant.immunityIds];
    }
    if (this.participant.resistanceIds) {
      this.resistances = [...this.participant.resistanceIds];
    }
    if (this.participant.featureIds) {
      this.features = [...this.participant.featureIds];
    }


    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: 'name'
    });

    this.allConditions$ = this.conditionsQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: 'name'
    });

    this.allFeatures$ = this.featureQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }
        return true;
      },
      sortBy: compareFeatures
    });
  }

  ngOnDestroy() {
    if (this.avatarUrl && this.avatarUrl !== this.initialAvatarUrl) {
      console.log('deleting in onDestroy function');
      this.deleteImageFromStorage(this.avatarUrl);
    }
    console.log('destroying encounter-participant-edit');
  }

  switchExpanded() {
    this.expanded = !this.expanded;
    this.expandedChanged.emit(this.expanded);
  }

  getImmunities(damageTypes, conditions) {
    const result = [];
    result.push(...damageTypes.map(item => ({...item, type: 'Damage Types'})));
    result.push(...conditions.map(item => ({...item, type: 'Conditions'})));
    return result;
  }

  deleteParticipant() {
    this.delete.emit();
  }

  rollInitiative() {
    this.initiative = Math.ceil(Math.random() * 20);
  }

  cancelEdit() {
    if (this.avatarUrl && this.avatarUrl !== this.initialAvatarUrl) {
      console.log('deleting in onDestroy function');
      this.deleteImageFromStorage(this.avatarUrl);
      this.avatarUrl = this.initialAvatarUrl;
    }
    this.changesCancelled.emit();
  }

  avatarChanged(newUrl: string) {
    if (this.avatarUrl && this.avatarUrl !== newUrl) {
      if (this.avatarUrl !== this.initialAvatarUrl) {
        console.log('deleting in update function');
        this.deleteImageFromStorage(this.avatarUrl);
      }
    }

    if (this.avatarUrl !== newUrl) {
      this.avatarUrl = newUrl;
    }
  }

  deleteAvatar() {
    if (this.avatarUrl) {
      if (this.avatarUrl !== this.initialAvatarUrl) {
        console.log('deleting in delete function');
        this.deleteImageFromStorage(this.avatarUrl);
      }

      this.avatarUrl = null;
    }
  }

  applyChanges() {
    console.log('saving participant', this.avatarUrl);
    const newParticipant = {
      id: this.participant.id,
      owner: this.participant.owner,
      type: this.participant.type,
      color: this.color,
      avatarUrl: this.avatarUrl,
      name: this.name,
      initiative: this.initiative,
      initiativeModifier: this.initiativeModifier,
      currentHp: this.currentHp,
      maxHp: this.maxHp,
      temporaryHp: this.temporaryHp,
      armorClass: this.armorClass,
      temporaryArmorClass: this.participant.temporaryArmorClass || null,
      speed: this.speed,
      swimSpeed: this.swimSpeed,
      climbSpeed: this.climbSpeed,
      flySpeed: this.flySpeed,
      temporarySpeed: this.participant.temporarySpeed == null ? null : this.participant.temporarySpeed,
      temporarySwimSpeed: this.participant.temporarySwimSpeed == null ? null : this.participant.temporarySwimSpeed,
      temporaryClimbSpeed: this.participant.temporaryClimbSpeed == null ? null : this.participant.temporaryClimbSpeed,
      temporaryFlySpeed: this.participant.temporaryFlySpeed == null ? null : this.participant.temporaryFlySpeed,
      vulnerabilityIds: this.vulnerabilities,
      resistanceIds: this.resistances,
      immunityIds: this.immunities,
      conditionIds: this.conditions,
      featureIds: this.features,
      comments: this.comments,
      advantages: this.participant.advantages || null,
      mapSizeX: this.mapSize || 1,
      mapSizeY: this.mapSize || 1
    };

    this.changesSaved.emit(newParticipant);

    this.initialAvatarUrl = null;
    this.avatarUrl = null;
  }

  deleteImageFromStorage(imageUrl) {
    const encounterParticipants = this.encounterParticipantQuery.getAll({
      filterBy: item => item.avatarUrl === imageUrl
    });
    const participantTemplates = this.participantQuery.getAll({
      filterBy: item => item.avatarUrl === imageUrl
    });
    if ((!encounterParticipants || encounterParticipants.length === 0) &&
        (!participantTemplates || participantTemplates.length === 0)) {
      console.log('delete!');
      this.storage.storage.refFromURL(imageUrl).delete();
    }
  }
}
