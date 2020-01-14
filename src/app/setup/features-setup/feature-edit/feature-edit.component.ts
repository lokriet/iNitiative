import { Component, Input, OnInit } from '@angular/core';
import { guid } from '@datorama/akita';
import { AuthService } from 'src/app/auth/state/auth.service';

import { FeatureQuery } from '../../state/features/feature.query';
import { FeatureService } from '../../state/features/feature.service';

@Component({
  selector: 'app-feature-edit',
  templateUrl: './feature-edit.component.html',
  styleUrls: ['./feature-edit.component.scss']
})
export class FeatureEditComponent implements OnInit {

  newFeatureColor: string = null;
  newFeatureName: string = null;
  newFeatureDescription: string = null;
  newFeatureType: string = null;

  @Input() popupMode = false;
  @Input() newButtonText = 'Add new';

  allFeatureTypes: any[] = [];

  constructor(private featureService: FeatureService,
              private featureQuery: FeatureQuery,
              private authService: AuthService) { }

  ngOnInit() {
    this.featureQuery.selectAll({filterBy: item => item.owner === this.authService.user.uid}).subscribe(features => {
      this.allFeatureTypes = Array.from(new Set(features.map(item => item.type)));
      this.allFeatureTypes.sort().map(item => ({type: item}));
    });
  }

  onSubmitNewFeature() {
    this.featureService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.newFeatureName,
      color: this.newFeatureColor,
      description: this.newFeatureDescription,
      type: this.newFeatureType
    });

    this.newFeatureColor = null;
    this.newFeatureName = null;
    this.newFeatureDescription = null;
    this.newFeatureType = null;
  }

  addTagFn(name) {
    return {type: name};
  }

  changeFeatureType(featureType) {
    this.newFeatureType = featureType;
  }

}
