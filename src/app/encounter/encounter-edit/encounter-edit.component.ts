import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { DamageTypeQuery } from 'src/app/setup/state/damage-type/damage-type.query';
import { FeatureQuery } from 'src/app/setup/state/features/feature.query';
import { Participant } from 'src/app/setup/state/participants/participant.model';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';

import { EncounterParticipant } from '../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../encounter-participant/state/encounter-participant.service';
import { Encounter } from '../state/encounter.model';
import { EncounterQuery } from '../state/encounter.query';
import { EncounterService } from '../state/encounter.service';

@Component({
  selector: 'app-encounter-edit',
  templateUrl: './encounter-edit.component.html',
  styleUrls: ['./encounter-edit.component.scss']
})
export class EncounterEditComponent implements OnInit, OnDestroy {
  playIcon = faPlay;

  encountersLoading$: Observable<boolean>;
  participantTemplatesLoading$: Observable<boolean>;
  participantsLoading$: Observable<boolean>;
  damageTypesLoading$: Observable<boolean>;
  conditionsLoading$: Observable<boolean>;
  featuresLoading$: Observable<boolean>;

  encounterName: string;
  errorMessage: string = null;

  addedParticipants: EncounterParticipant[] = [];
  avatarUrlsToCheck = new Set<string>();

  editMode = false;
  editedEncounter: Encounter;
  sub: Subscription;

  constructor(private encounterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private participantTemplateQuery: ParticipantQuery,
              private encounterParticipantsQuery: EncounterParticipantQuery,
              private encounterParticipantsService: EncounterParticipantService,
              private damageTypesQuery: DamageTypeQuery,
              private conditionsQuery: ConditionsQuery,
              private featuresQuery: FeatureQuery,
              private storage: AngularFireStorage,
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
    this.featuresLoading$ = this.featuresQuery.selectLoading();

    this.sub = this.route.params.subscribe(
      (params: Params) => {
        const editedEncounterId = params.id;
        this.editMode = params.id != null;
        this.initForm(editedEncounterId);
      }
    );
  }

  ngOnDestroy(): void {
    console.log('destroying encounter edit');
    this.deleteUnusedAvatarsFromStorage();

    this.sub.unsubscribe();
  }


  initForm(editedEncounterId: string) {
    if (this.editMode) {
      this.editedEncounter = this.encounterQuery.getEntity(editedEncounterId);
      if (!this.editedEncounter || this.editedEncounter.owner !== this.authService.user.uid) {
        this.router.navigate(['404']);
      } else {
        this.encounterName = this.editedEncounter.name;
        if (this.editedEncounter.participantIds) {
          this.addedParticipants = this.encounterParticipantsQuery.getAll({
            filterBy: item => this.editedEncounter.participantIds.includes(item.id)
          });

          this.addedParticipants = this.addedParticipants.map(item => ({ ...item,
                                            conditionIds: item.conditionIds ? [...item.conditionIds] : [],
                                            featureIds: item.featureIds ? [...item.featureIds] : [],
                                            immunityIds: item.immunityIds ? [...item.immunityIds] : [],
                                            resistanceIds: item.resistanceIds ? [...item.resistanceIds] : [],
                                            vulnerabilityIds: item.vulnerabilityIds ? [...item.vulnerabilityIds] : []}));

          for (const participant of this.addedParticipants) {
            if (participant.avatarUrl != null) {
              this.avatarUrlsToCheck.add(participant.avatarUrl);
            }
          }
        } else {
          this.addedParticipants = [];
        }
      }
    }
  }

  async onSubmitForm(startPlaying: boolean) {
    if (!this.encounterName) {
      this.errorMessage = 'You forgot to name your encounter!';
      return;
    }

    if (!this.editMode || this.editedEncounter.name !== this.encounterName) {
      const existingName = this.encounterQuery.getAll({filterBy: encounter => encounter.name === this.encounterName});
      if (existingName != null && existingName.length > 0) {
        this.errorMessage = 'Encounter with this name already exists. Choose another one';
        return;
      }
    }

    const currentDate = new Date();

    for (const participant of this.addedParticipants) {
      if (this.encounterParticipantsQuery.getEntity(participant.id) == null) {
        await this.encounterParticipantsService.add(participant);
      } else {
        this.encounterParticipantsService.update(participant);
      }
    }

    if (this.editMode) {
      const deletedParticipants =
        this.editedEncounter.participantIds.filter(participantId =>
                                                      this.addedParticipants.findIndex(item => item.id === participantId) < 0);
      if (deletedParticipants && deletedParticipants.length > 0) {
        await this.encounterParticipantsService.remove(deletedParticipants);
      }
    }

    let activeParticipantId = null;
    if (this.editMode && this.editedEncounter.activeParticipantId) {
      activeParticipantId = this.editedEncounter.activeParticipantId;
    }

    const newEncounter = {
      id: this.editMode ? this.editedEncounter.id : guid(),
      owner: this.authService.user.uid,
      name: this.encounterName,
      participantIds: [...this.addedParticipants.map(participant => participant.id)],
      createdDate: this.editMode ? this.editedEncounter.createdDate : currentDate.getTime(),
      lastModifiedDate: currentDate.getTime(),
      activeParticipantId,
      mapId: this.editMode ? this.editedEncounter.mapId : null
    };

    if (!this.editMode) {
      await this.encounterService.add(newEncounter);

      this.messageService.addInfo(`Yay, encounter ${this.encounterName} created!`);

      if (startPlaying) {
        this.router.navigate(['encounters', 'play', newEncounter.id]);
      } else {
        this.router.navigate(['encounters']);
      }
    } else {
      this.encounterService.update(newEncounter);
      this.messageService.addInfo(`Yay, encounter ${this.encounterName} saved!`);

      if (startPlaying) {
        this.router.navigate(['encounters', 'play', newEncounter.id]);
      } else {
        this.router.navigate(['encounters']);
      }
    }

    this.deleteUnusedAvatarsFromStorage();
  }

  findNameWithNo(name: string): string {
    let counter = 0;
    let nextName = name;
    while (true) {
      if (this.addedParticipants.findIndex(item => item.name === nextName) === -1) {
        return nextName;
      } else {
        counter++;
        nextName = `${name} ${counter}`;
      }
    }
  }

  addParticipant(participantTemplate: Participant) {
    const encounterParticipant = {
      id: guid(),
      owner: this.authService.user.uid,
      type: participantTemplate.type,
      name: this.findNameWithNo(participantTemplate.name),
      avatarUrl: participantTemplate.avatarUrl,
      color: participantTemplate.color,
      initiative: null,
      initiativeModifier: participantTemplate.initiativeModifier,
      currentHp: participantTemplate.maxHp,
      maxHp: participantTemplate.maxHp,
      temporaryHp: 0,
      armorClass: participantTemplate.armorClass,
      temporaryArmorClass: null,
      speed: participantTemplate.speed,
      temporarySpeed: null,
      vulnerabilityIds: participantTemplate.vulnerabilityIds ? [...participantTemplate.vulnerabilityIds] : [],
      immunityIds: participantTemplate.immunityIds ? [...participantTemplate.immunityIds] : [],
      resistanceIds: participantTemplate.resistanceIds ? [...participantTemplate.resistanceIds] : [],
      conditionIds: [],
      featureIds: participantTemplate.featureIds ? [...participantTemplate.featureIds] : [],
      comments: participantTemplate.comments,
      advantages: null,
      mapSizeX: participantTemplate.mapSizeX || 1,
      mapSizeY: participantTemplate.mapSizeY || 1
    };

    this.addedParticipants.push(encounterParticipant);
    if (participantTemplate.avatarUrl != null) {
      this.avatarUrlsToCheck.add(participantTemplate.avatarUrl);
    }
  }

  onParticipantsChanged(updatedParticipants) {
    // console.log('participants changed', updatedParticipants);
    for (const participant of updatedParticipants) {
      if (participant.avatarUrl != null) {
        this.avatarUrlsToCheck.add(participant.avatarUrl);
      }
    }

    this.addedParticipants = updatedParticipants;
    console.log(this.avatarUrlsToCheck);
  }

  deleteUnusedAvatarsFromStorage() {
    let avatarUrls = Array.from(this.avatarUrlsToCheck);
    // console.log('checking avatars', avatarUrls);

    // 1. delete participant avatars from storage
    if (avatarUrls.length > 0) {

      // filter out avatars used by existing participant templates
      const participantTemplates = this.participantTemplateQuery.getAll({filterBy: item =>
        item.avatarUrl != null && avatarUrls.includes(item.avatarUrl)
      });

      if (participantTemplates && participantTemplates.length > 0) {
        avatarUrls = avatarUrls.filter(avatarUrl =>
          participantTemplates.findIndex(item =>
            item.avatarUrl === avatarUrl
          ) < 0
        );
      }

      if (avatarUrls.length > 0) {
        // console.log('filtered participant templates, avatars to check left', avatarUrls);
        // filter out avatars used by participants of other encounters
        const encounterParticipants = this.encounterParticipantsQuery.getAll({filterBy: item =>
          item.avatarUrl != null && avatarUrls.includes(item.avatarUrl)
        });
        // console.log('encounter participants found', encounterParticipants);



        if (encounterParticipants && encounterParticipants.length > 0) {
          avatarUrls = avatarUrls.filter(avatarUrl =>
            encounterParticipants.findIndex(item =>
              item.avatarUrl === avatarUrl
            ) < 0
          );
        }

        if (avatarUrls.length > 0) {
          // console.log('delete unfiltered avatars in last check', avatarUrls);
          // if anything left delete them
          for (const avatarUrl of avatarUrls) {
            this.storage.storage.refFromURL(avatarUrl).delete();
          }
        }
      }
    }

    this.avatarUrlsToCheck = new Set<string>();
  }
}
