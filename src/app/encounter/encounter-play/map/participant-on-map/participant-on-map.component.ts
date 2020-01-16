import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { EncounterParticipant } from 'src/app/encounter/encounter-participant/state/encounter-participant.model';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { ConditionsQuery } from 'src/app/setup/state/conditions/conditions.query';
import { ParticipantType } from 'src/app/setup/state/participants/participant.model';

@Component({
  selector: 'app-participant-on-map',
  templateUrl: './participant-on-map.component.html',
  styleUrls: ['./participant-on-map.component.scss']
})
export class ParticipantOnMapComponent implements OnInit {
  @Input() participant: EncounterParticipant;
  @Input() initialInfoPos: {x: number, y: number};
  @Input() showInfo = true;
  initialX: number;
  initialY: number;

  @Output() infoMoved = new EventEmitter<{x: number, y: number}>();

  conditions$: Observable<Condition[]>;

  @ViewChild('participantOnMap') parentElement: ElementRef;

  constructor(private conditionsQuery: ConditionsQuery) { }

  ngOnInit() {
    this.conditions$ = this.conditionsQuery.selectAll({filterBy: item => this.participant.conditionIds.includes(item.id)});
    if (this.initialInfoPos) {
      this.initialX = this.initialInfoPos.x;
      this.initialY = this.initialInfoPos.y;
    }
  }

  iconText(participantName: string): string {
    return participantName.substr(0, 1).toUpperCase();
  }

  fontSize(): number {
    return (this.parentElement.nativeElement as HTMLElement).getBoundingClientRect().height * 0.7;
  }

  hasConditions(): boolean {
    return this.participant.conditionIds && this.participant.conditionIds.length > 0;
  }

  getHp(): string {
    if (this.participant.type === ParticipantType.Monster) {
      return `HP: ${this.participant.currentHp - this.participant.maxHp}`;
    } else {
      return `HP: ${this.participant.currentHp}/${this.participant.maxHp}`;
    }
  }

  dragInfoEnded(event: CdkDragEnd) {
    console.log(event);
    const transform = event.source.element.nativeElement.style.transform;
    const regex = /translate3d\(\s?([-]?\d*)px,\s?([-]?\d*)px,\s?([-]?\d*)px\)/;
    const values = regex.exec(transform);
    console.log(transform);
    const offset = { x: parseInt(values[1]), y: parseInt(values[2]) };

    if (this.initialInfoPos) {
      offset.x = offset.x + this.initialInfoPos.x;
      offset.y = offset.y + this.initialInfoPos.y;
    }

    console.log(offset);

    this.infoMoved.emit(offset);
  }
}
