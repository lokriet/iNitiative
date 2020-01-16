import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { EncounterParticipantQuery } from 'src/app/encounter/encounter-participant/state/encounter-participant.query';
import { MessageService } from 'src/app/messages/state/message.service';

import { Condition } from '../../state/conditions/condition.model';
import { ConditionsQuery } from '../../state/conditions/conditions.query';
import { DamageType } from '../../state/damage-type/damage-type.model';
import { DamageTypeQuery } from '../../state/damage-type/damage-type.query';
import { Feature } from '../../state/features/feature.model';
import { FeatureQuery } from '../../state/features/feature.query';
import { Participant, ParticipantType } from '../../state/participants/participant.model';
import { ParticipantQuery } from '../../state/participants/participant.query';
import { ParticipantService } from '../../state/participants/participant.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit, OnDestroy {
  selectedIcon = faToggleOn;
  unselectedIcon = faToggleOff;

  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;
  featuresLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;

  color: string = null;
  name: string;
  type = ParticipantType.Player;
  initiativeModifier: number;
  hp: number;
  armorClass: number;
  speed: number;

  immunities: string[] = [];
  resistances: string[] = [];
  weaknesses: string[] = [];

  features: string[] = [];

  comments: string = null;

  mapSizeX = 1;
  mapSizeY = 1;
  avatarUrl: string = null;
  initialAvatarUrl: string = null;

  errorMessage: string = null;

  allDamageTypes$: Observable<DamageType[]>;
  allFeatures$: Observable<Feature[]>;
  allConditions$: Observable<Condition[]>;

  routeSub: Subscription;
  editMode = false;

  editedParticipant: Participant;

  constructor(private damageTypeQuery: DamageTypeQuery,
              private featureQuery: FeatureQuery,
              private conditionQuery: ConditionsQuery,
              private participantService: ParticipantService,
              private participantQuery: ParticipantQuery,
              private encounterParticipantQuery: EncounterParticipantQuery,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.damageTypesLoading$ = this.damageTypeQuery.selectLoading();
    this.featuresLoading$ = this.featureQuery.selectLoading();
    this.conditionsLoading$ = this.conditionQuery.selectLoading();
    this.participantsLoading$ = this.participantQuery.selectLoading();

    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });

    this.allFeatures$ = this.featureQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });

    this.allConditions$ = this.conditionQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });

    this.routeSub = this.route.params.subscribe(
      (params: Params) => {
        const editedParticipantId = params.id;
        this.editMode = params.id != null;
        this.initForm(editedParticipantId);
      }
    );
  }

  ngOnDestroy() {
    if (this.avatarUrl && this.avatarUrl !== this.initialAvatarUrl) {
      console.log('deleting in onDestroy function', this.avatarUrl);
      this.storage.storage.refFromURL(this.avatarUrl).delete();
    }
    this.routeSub.unsubscribe();
    console.log('destroying participant-template-edit');
  }

  initForm(editedParticipantId: string) {
    if (!this.editMode) {
      return;
    }

    this.editedParticipant = this.participantQuery.getEntity(editedParticipantId);

    if (!this.editedParticipant) {
      this.router.navigate(['/404']);
    }

    this.color = this.editedParticipant.color;
    this.name = this.editedParticipant.name;
    this.type = this.editedParticipant.type;
    this.initiativeModifier = this.editedParticipant.initiativeModifier;
    this.armorClass = this.editedParticipant.armorClass;
    this.speed = this.editedParticipant.speed;
    this.hp = this.editedParticipant.maxHp;
    this.immunities = this.editedParticipant.immunityIds ? [...this.editedParticipant.immunityIds] : [];
    this.weaknesses = this.editedParticipant.vulnerabilityIds ? [...this.editedParticipant.vulnerabilityIds] : [];
    this.resistances = this.editedParticipant.resistanceIds ? [...this.editedParticipant.resistanceIds] : [];
    this.features = this.editedParticipant.featureIds ? [...this.editedParticipant.featureIds] : [];
    this.comments = this.editedParticipant.comments;
    this.mapSizeX = this.editedParticipant.mapSizeX || 1;
    this.mapSizeY = this.editedParticipant.mapSizeY || 1;
    this.avatarUrl = this.editedParticipant.avatarUrl || null;
    this.initialAvatarUrl = this.avatarUrl;
  }

  getImmunities(damageTypes, conditions) {
    const result = [];
    result.push(...damageTypes.map(damageType => ({...damageType, type: 'Damage Types'})));
    result.push(...conditions.map(condition => ({...condition, type: 'Conditions'})));
    return result;
  }

  avatarChanged(newUrl: string) {
    if (this.avatarUrl && this.avatarUrl !== newUrl) {
      if (this.initialAvatarUrl !== this.avatarUrl) {
        console.log('deleting in update function');
        this.storage.storage.refFromURL(this.avatarUrl).delete();
      }
    }

    if (this.avatarUrl !== newUrl) {
      this.avatarUrl = newUrl;
    }
  }

  deleteAvatar() {
    if (this.avatarUrl != null) {
      if (this.initialAvatarUrl !== this.avatarUrl) {
        console.log('deleting in delete function');
        this.storage.storage.refFromURL(this.avatarUrl).delete();
      }

      this.avatarUrl = null;
    }
  }

  onSubmit() {
    if (!this.editMode || this.name !== this.editedParticipant.name) {
      if (this.participantQuery.getAll({filterBy: participant => participant.name === this.name}).length > 0) {
        this.errorMessage = 'Participant with this name already exists. Choose another one.';
        return;
      }
    }

    this.errorMessage = null;
    const newParticipant = {
      id: this.editMode ? this.editedParticipant.id : guid(),
      owner: this.editMode ? this.editedParticipant.owner : this.authService.user.uid,
      name: this.name,
      type: this.type,
      color: this.color,
      initiativeModifier: this.initiativeModifier,
      maxHp: this.hp,
      armorClass: this.armorClass,
      speed: this.speed,
      vulnerabilityIds: this.weaknesses,
      resistanceIds: this.resistances,
      immunityIds: this.immunities,
      featureIds: this.features,
      comments: this.comments,
      mapSizeX: this.mapSizeX,
      mapSizeY: this.mapSizeY,
      avatarUrl: this.avatarUrl
    };


    if (this.editMode) {
      this.participantService.update(newParticipant)
      .then(value => {
        this.messageService.addInfo(`${this.name} updated!`);
        this.router.navigate(['/setup-participants']);
      }).catch(error => {
        this.messageService.addError('Could not update participant :(');
        console.log(error);
      });
    } else {
      this.participantService.add(newParticipant)
      .then(value => {
        this.messageService.addInfo(`${this.name} created!`);
        this.router.navigate(['/setup-participants']);
      }).catch(error => {
        this.messageService.addError('Could not create participant :(');
        console.log(error);
      });
    }

    if (this.initialAvatarUrl && this.initialAvatarUrl !== this.avatarUrl) {
      console.log('deleting in save function');
      this.deleteImageFromStorage(this.initialAvatarUrl);
    }

    this.initialAvatarUrl = null;
    this.avatarUrl = null;
  }

  deleteImageFromStorage(imageUrl) {
    const encounterParticipants = this.encounterParticipantQuery.getAll({
      filterBy: item => item.avatarUrl === imageUrl
    });
    if (!encounterParticipants || encounterParticipants.length === 0) {
      this.storage.storage.refFromURL(imageUrl).delete();
    }
  }
}
