import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sort-icon',
  templateUrl: './sort-icon.component.html',
  styleUrls: ['./sort-icon.component.scss']
})
export class SortIconComponent implements OnInit {
  faUp = faSortUp;
  faDown = faSortDown;

  @Input() isActive: boolean;
  @Input() isSortUp: boolean;
  @Output() sortingSwitched = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  setSorting(up: boolean) {
    this.sortingSwitched.emit(up);
  }

}
