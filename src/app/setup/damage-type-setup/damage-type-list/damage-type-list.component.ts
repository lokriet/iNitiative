import { Component, OnInit, Input } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SortBy, Order } from '@datorama/akita';
import { DamageType, DamageTypeType } from '../../state/damage-type/damage-type.model';
import { DamageTypeService } from '../../state/damage-type/damage-type.service';
import { DamageTypeQuery } from '../../state/damage-type/damage-type.query';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';

@Component({
  selector: 'app-damage-type-list',
  templateUrl: './damage-type-list.component.html',
  styleUrls: ['./damage-type-list.component.scss']
})
export class DamageTypeListComponent implements OnInit {
  deleteIcon = faTimes;

  @Input() damageTypeType: DamageTypeType = null;

  nameFilter: string;
  typeFilter: DamageTypeType[];
  damageTypeFilter: DamageTypeType;
  sortBy: SortBy<DamageType, any> = 'name';
  sortByOrder = Order.ASC;

  allDamageTypes$: Observable<DamageType[]>;

  constructor(private damageTypeService: DamageTypeService,
              private damageTypeQuery: DamageTypeQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.selectDamageTypes();
  }

  selectDamageTypes(): void {
    this.allDamageTypes$ = this.damageTypeQuery.selectAll({
      filterBy: item => {
        if (item.owner !== this.authService.user.uid) {
          return false;
        }

        if (this.nameFilter && this.nameFilter.length > 0) {
          if (!item.name.toLowerCase().includes(this.nameFilter.toLowerCase())) {
            return false;
          }
        }

        if (this.damageTypeType != null) {
          if (item.type !== this.damageTypeType) {
            return false;
          }
        } else {
          if (this.typeFilter && this.typeFilter.length > 0) {
            if (!this.typeFilter.includes(item.type)) {
              return false;
            }
          }
        }
        return true;
      },
      sortBy: this.sortBy === 'type' ? this.sortByType.bind(this) : this.sortBy,
      sortByOrder: this.sortByOrder
    });
  }

  onNameFilterChanged(nameFilter: string) {
    this.nameFilter = nameFilter;
    this.selectDamageTypes();
  }

  isSortingByName() {
    return this.sortBy === 'name';
  }

  isSortingByType() {
    return this.sortBy === 'type';
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  changeSortOrder(sortBy: SortBy<DamageType, any>, isAsc: boolean) {
    if (this.sortBy === sortBy &&
      ((isAsc && this.sortByOrder === Order.ASC) ||
       (!isAsc && this.sortByOrder === Order.DESC))
    ) {
      return;
    }

    this.sortBy = sortBy;
    this.sortByOrder = isAsc ? Order.ASC : Order.DESC;
    this.selectDamageTypes();
  }

  switchSortOrder(sortBy: SortBy<DamageType, any>) {
    if (this.sortBy === sortBy) {
      this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.sortBy = sortBy;
      this.sortByOrder = Order.ASC;
    }
    this.selectDamageTypes();
  }

  sortByType(a: DamageType, b: DamageType): number {
    if (a.type !== b.type) {
      const result = a.type - b.type;
      return this.sortByOrder === Order.ASC ? result : -result;
    }

    return a.name.localeCompare(b.name);
  }

  onTypeFilterChanged(value: any[]) {
    this.typeFilter = [...value].map(el => el.value);
    this.selectDamageTypes();
  }

  onDeleteDamageType(damageTypeId: string) {
    if (confirm('Are you sure?')) {
      this.damageTypeService.remove(damageTypeId);
    }
  }

  onChangeColor(damageType, newColor) {
    this.damageTypeService.update({...damageType, color: newColor});
  }

  onChangeName(damageType, newName) {
    this.damageTypeService.update({...damageType, name: newName});
  }

}
