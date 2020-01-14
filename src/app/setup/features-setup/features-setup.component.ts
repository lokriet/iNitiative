import { Component, OnInit } from '@angular/core';
import { Order, SortBy } from '@datorama/akita';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/state/auth.service';

import { Feature } from '../state/features/feature.model';
import { FeatureQuery } from '../state/features/feature.query';
import { FeatureService } from '../state/features/feature.service';

@Component({
  selector: 'app-features-setup',
  templateUrl: './features-setup.component.html',
  styleUrls: ['./features-setup.component.scss']
})
export class FeaturesSetupComponent implements OnInit {

  deleteIcon = faTimes;

  featuresLoading$: Observable<boolean>;
  allFeatures$: Observable<Feature[]>;

  sortBy: SortBy<Feature, any> = 'name';
  sortByOrder = Order.ASC;
  nameFilter: string = null;

  allFeatureTypes: any[] = [];

  constructor(private featureQuery: FeatureQuery,
              private featureService: FeatureService,
              private authService: AuthService) { }

  ngOnInit() {
    this.featuresLoading$ = this.featureQuery.selectLoading();
    this.selectFeatures();
  }

  selectFeatures() {
    this.allFeatures$ = this.featureQuery.selectAll({
      filterBy: feature => {
        if (feature.owner !== this.authService.user.uid) {
          return false;
        }

        return true;
      },
      sortBy: this.sortBy === 'type' ? this.sortByType.bind(this) : this.sortBy,
      sortByOrder: this.sortByOrder
    });

    this.allFeatures$.subscribe(features => {
      this.allFeatureTypes = Array.from(new Set(features.map(item => item.type)));
      this.allFeatureTypes.sort().map(item => ({type: item}));
    });
  }

  isSortingAsc() {
    return this.sortByOrder === Order.ASC;
  }

  // switchSortOrder() {
  //   this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
  //   this.selectFeatures();
  // }

  switchSortOrder(sortBy: SortBy<Feature, any>) {
    if (this.sortBy === sortBy) {
      this.sortByOrder = this.sortByOrder === Order.ASC ? Order.DESC : Order.ASC;
    } else {
      this.sortBy = sortBy;
      this.sortByOrder = Order.ASC;
    }
    this.selectFeatures();
  }

  // changeSortOrder(toAsc: boolean) {
  //   this.sortByOrder = toAsc ? Order.ASC : Order.DESC;
  //   this.selectFeatures();
  // }

  changeSortOrder(sortBy: SortBy<Feature, any>, isAsc: boolean) {
    if (this.sortBy === sortBy &&
         ((isAsc && this.sortByOrder === Order.ASC) ||
          (!isAsc && this.sortByOrder === Order.DESC))
       ) {
      return;
    }

    this.sortBy = sortBy;
    this.sortByOrder = isAsc ? Order.ASC : Order.DESC;
    this.selectFeatures();
  }

  sortByType(a: Feature, b: Feature): number {
    if (a.type !== b.type) {
      const result = a.type.localeCompare(b.type);
      return this.sortByOrder === Order.ASC ? result : -result;
    }

    return a.name.localeCompare(b.name);
  }

  isSortingByName() {
    return this.sortBy === 'name';
  }

  isSortingByType() {
    return this.sortBy === 'type';
  }

  onNameFilterChanged(nameFilter: string) {
    this.nameFilter = nameFilter;
    this.selectFeatures();
  }

  onChangeColor(feature: Feature, newColor: string) {
    this.featureService.update({...feature, color: newColor});
  }

  onChangeName(feature: Feature, newName: string) {
    if (newName != null && newName.length > 0) {
      this.featureService.update({...feature, name: newName});
    }
  }

  onChangeType(feature: Feature, newType: string) {
    this.featureService.update({...feature, type: newType});
  }

  onDeleteFeature(featureId: string) {
    if (confirm('Are you sure?')) {
      this.featureService.remove(featureId);
    }
  }

  onChangeDescription(feature: Feature, description: string) {
    if (feature.description !== description) {
      this.featureService.update({...feature, description});
    }
  }

  addTagFn(name) {
    return {type: name};
  }
}
