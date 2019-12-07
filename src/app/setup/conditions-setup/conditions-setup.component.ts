import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ConditionsQuery } from '../state/conditions/conditions.query';
import { Condition } from '../state/conditions/condition.model';
import { AuthService } from 'src/app/auth/state/auth.service';
import { SortBy, Order, guid } from '@datorama/akita';
import { faSortAlphaDown, faSortAlphaDownAlt } from '@fortawesome/free-solid-svg-icons';
import { ConditionsService } from '../state/conditions/conditions.service';

@Component({
  selector: 'app-conditions-setup',
  templateUrl: './conditions-setup.component.html',
  styleUrls: ['./conditions-setup.component.scss']
})
export class ConditionsSetupComponent implements OnInit {
  sortAscIcon = faSortAlphaDown;
  sortDescIcon = faSortAlphaDownAlt;

  conditionsLoading$: Observable<boolean>;
  allConditions$: Observable<Condition[]>;

  newConditionColor: string = null;
  newConditionName: string = null;

  sortBy: SortBy<Condition, any> = 'name';
  sortByOrder = Order.ASC;
  nameFilter: string = null;

  constructor(private conditionQuery: ConditionsQuery,
              private conditionService: ConditionsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.conditionsLoading$ = this.conditionQuery.selectLoading();
    this.selectConditions();
  }

  selectConditions() {
    this.allConditions$ = this.conditionQuery.selectAll({
      filterBy: condition => {
        if (condition.owner !== this.authService.user.uid) {
          return false;
        }

        if (this.nameFilter && this.nameFilter.length > 0) {
          if (!condition.name.toLowerCase().includes(this.nameFilter.toLowerCase())) {
            return false;
          }
        }

        return true;
      },
      sortBy: this.sortBy,
      sortByOrder: this.sortByOrder
    });
  }

  onSubmitNewCondition() {
    this.conditionService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.newConditionName,
      color: this.newConditionColor
    });

    this.newConditionColor = null;
    this.newConditionName = null;

    this.selectConditions();
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  switchSortOrder() {
    this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
    this.selectConditions();
  }

  changeSortOrder(toAsc: boolean) {
    this.sortByOrder = toAsc ? Order.ASC : Order.DESC;
    this.selectConditions();
  }

  onNameFilterChanged(nameFilter) {
    this.nameFilter = nameFilter;
    this.selectConditions();
  }

  onChangeColor(condition, newColor) {
    this.conditionService.update({...condition, color: newColor});
  }

  onChangeName(condition, newName) {
    if (newName != null && newName.length > 0) {
      this.conditionService.update({...condition, name: newName});
    }

  }

  onDeleteCondition(conditionId: string) {
    if (confirm('Are you sure?')) {
      this.conditionService.remove(conditionId);
    }
  }
}
