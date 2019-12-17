import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/state/auth.service';
import { guid } from '@datorama/akita';
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

  @Input() popupMode = false;
  @Input() newButtonText = 'Add new';

  constructor(private featureService: FeatureService,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmitNewFeature() {
    this.featureService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.newFeatureName,
      color: this.newFeatureColor,
      description: this.newFeatureDescription
    });

    this.newFeatureColor = null;
    this.newFeatureName = null;
    this.newFeatureDescription = null;
  }

}
