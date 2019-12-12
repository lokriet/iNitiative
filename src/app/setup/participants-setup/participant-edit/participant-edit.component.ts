import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';
import { MessageService } from 'src/app/messages/state/message.service';

import { DamageType } from '../../state/damage-type/damage-type.model';
import { DamageTypeQuery } from '../../state/damage-type/damage-type.query';
import { ParticipantType, Participant } from '../../state/participants/participant.model';
import { ParticipantQuery } from '../../state/participants/participant.query';
import { ParticipantService } from '../../state/participants/participant.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit {
  selectedIcon = faToggleOn;
  unselectedIcon = faToggleOff;

  damageTypesLoading$: Observable<boolean>;
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

  comments: string;

  errorMessage: string = null;

  allDamageTypes$: Observable<DamageType[]>;

  routeSub: Subscription;
  editMode = false;

  editedParticipant: Participant;

  constructor(private damageTypeQuery: DamageTypeQuery,
              private participantService: ParticipantService,
              private participantQuery: ParticipantQuery,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService) { }

  ngOnInit() {
    this.damageTypesLoading$ = this.damageTypeQuery.selectLoading();
    this.participantsLoading$ = this.participantQuery.selectLoading();

    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
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

  initForm(editedParticipantId: string) {
    this.editedParticipant = this.participantQuery.getEntity(editedParticipantId);
    this.color = this.editedParticipant.color;
    this.name = this.editedParticipant.name;
    this.type = this.editedParticipant.type;
    this.initiativeModifier = this.editedParticipant.initiativeModifier;
    this.armorClass = this.editedParticipant.armorClass;
    this.speed = this.editedParticipant.speed;
    this.hp = this.editedParticipant.maxHp;
    this.immunities = [...this.editedParticipant.immunityIds];
    this.weaknesses = [...this.editedParticipant.vulnerabilityIds];
    this.resistances = [...this.editedParticipant.resistanceIds];
    this.comments = this.editedParticipant.comments;
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
      comments: this.comments
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

  }
}
