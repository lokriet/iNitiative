import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent implements OnInit {
  @Input() windowName: string;
  @Input() toggleIcon: IconDefinition;
  @Input() hidingIcon = false;

  @Input() items: any[]; // Condition[] | Feature[] | DamageType[]
  @Output() itemsSelected = new EventEmitter<string[]>();

  selectedItems: boolean[];

  constructor() { }

  ngOnInit() {
    this.clearSelected();
  }

  clearSelected() {
    if (this.items && this.items.length > 0) {
      this.selectedItems = Array(this.items.length).fill(false);
    } else {
      this.selectedItems = [];
    }
  }

  onSelectItems() {
    this.itemsSelected.emit(this.items.filter((item, index) => this.selectedItems[index]).map(item => item.id));
  }

}
