import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DamageType } from '../../state/damage-type/damage-type.model';
import { DamageTypeQuery } from '../../state/damage-type/damage-type.query';
import { ParticipantService } from '../../state/participants/participant.service';
import { ParticipantQuery } from '../../state/participants/participant.query';
import { guid } from '@datorama/akita';
import { AuthService } from 'src/app/auth/state/auth.service';
import { ParticipantType } from '../../state/participants/participant.model';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/messages/state/message.service';

@Component({
  selector: 'app-participant-edit',
  templateUrl: './participant-edit.component.html',
  styleUrls: ['./participant-edit.component.scss']
})
export class ParticipantEditComponent implements OnInit {
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

  constructor(private damageTypeQuery: DamageTypeQuery,
              private participantService: ParticipantService,
              private participantQuery: ParticipantQuery,
              private authService: AuthService,
              private router: Router,
              private messageService: MessageService) { }

  ngOnInit() {
    this.damageTypesLoading$ = this.damageTypeQuery.selectLoading();
    this.participantsLoading$ = this.participantQuery.selectLoading();

    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
      filterBy: item => item.owner === this.authService.user.uid,
      sortBy: 'name'
    });
  }

  onSubmit() {
    if (this.participantQuery.getAll({filterBy: participant => participant.name === this.name}).length > 0) {
      this.errorMessage = 'Participant with this name already exists. Choose another one.';
      return;
    } else {
      this.errorMessage = null;
      this.participantService.add({
        id: guid(),
        owner: this.authService.user.uid,
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
      })
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
