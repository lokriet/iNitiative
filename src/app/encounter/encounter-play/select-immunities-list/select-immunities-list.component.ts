import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Condition } from 'src/app/setup/state/conditions/condition.model';
import { DamageType } from 'src/app/setup/state/damage-type/damage-type.model';

@Component({
  selector: 'app-select-immunities-list',
  templateUrl: './select-immunities-list.component.html',
  styleUrls: ['./select-immunities-list.component.scss']
})
export class SelectImmunitiesListComponent implements OnInit {

  @Input() windowName: string;
  @Input() toggleIcon: IconDefinition;
  @Input() hidingIcon = false;

  @Input() conditions: Condition[];
  @Input() damageTypes: DamageType[];
  @Output() itemsSelected = new EventEmitter<string[]>();

  selectedDamageTypes: boolean[];
  selectedConditions: boolean[];

  constructor() { }

  ngOnInit() {
    this.clearSelected();
  }

  clearSelected() {
    if (this.conditions && this.conditions.length > 0) {
      this.selectedConditions = Array(this.conditions.length).fill(false);
    } else {
      this.selectedConditions = [];
    }
    if (this.damageTypes && this.damageTypes.length > 0) {
      this.selectedDamageTypes = Array(this.damageTypes.length).fill(false);
    } else {
      this.selectedDamageTypes = [];
    }
  }

  onSelectItems() {
    const result = [];
    result.push(...this.conditions.filter((item, index) => this.selectedConditions[index]).map(item => item.id));
    result.push(...this.damageTypes.filter((item, index) => this.selectedDamageTypes[index]).map(item => item.id));
    this.itemsSelected.emit(result);
  }

}
