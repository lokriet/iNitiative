import { Component, OnInit, Input } from '@angular/core';
import { ConditionsService } from '../../state/conditions/conditions.service';
import { AuthService } from 'src/app/auth/state/auth.service';
import { guid } from '@datorama/akita';

@Component({
  selector: 'app-condition-edit',
  templateUrl: './condition-edit.component.html',
  styleUrls: ['./condition-edit.component.scss']
})
export class ConditionEditComponent implements OnInit {
  newConditionColor: string = null;
  newConditionName: string = null;

  @Input() newButtonText = 'Add new';

  constructor(private conditionService: ConditionsService,
              private authService: AuthService) { }

  ngOnInit() {
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
  }


}
