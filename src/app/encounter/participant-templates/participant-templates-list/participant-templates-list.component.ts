import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParticipantQuery } from 'src/app/setup/state/participants/participant.query';
import { AuthService } from 'src/app/auth/state/auth.service';
import { ParticipantType, Participant } from 'src/app/setup/state/participants/participant.model';
import { Observable } from 'rxjs';
import { Order } from '@datorama/akita';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-participant-templates-list',
  templateUrl: './participant-templates-list.component.html',
  styleUrls: ['./participant-templates-list.component.scss']
})
export class ParticipantTemplatesListComponent implements OnInit {
  faSearch = faSearch;

  @Input() type: ParticipantType;
  @Output() participantAdded = new EventEmitter<Participant>();

  participants$: Observable<Participant[]>;

  sortByOrder = Order.ASC;
  filter: string = null;

  constructor(private participantTemplateQuery: ParticipantQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.selectParticipantTemplates();
  }

  selectParticipantTemplates() {
    this.participants$ = this.participantTemplateQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }

        if (this.type != null && item.type !== this.type) {
          return false;
        }

        if (this.filter && this.filter.length > 0 && !item.name.toLowerCase().includes(this.filter.toLowerCase())) {
          return false;
        }

        return true;
      },
      sortBy: 'name',
      sortByOrder: this.sortByOrder
    });
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  setSorting(up: boolean) {
    this.sortByOrder = up ? Order.ASC : Order.DESC;
    this.selectParticipantTemplates();
  }

  filterItems(filterString) {
    this.filter = filterString;
    this.selectParticipantTemplates();
  }

  onParticipantAdded(participantTemplate: Participant) {
    this.participantAdded.emit(participantTemplate);
  }
}
