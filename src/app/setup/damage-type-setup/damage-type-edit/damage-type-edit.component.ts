import { Component, OnInit, Input } from '@angular/core';

import { DamageTypeType } from '../../state/damage-type/damage-type.model';
import { DamageTypeService } from '../../state/damage-type/damage-type.service';
import { AuthService } from 'src/app/auth/state/auth.service';
import { guid } from '@datorama/akita';
import { Router } from '@angular/router';

@Component({
  selector: 'app-damage-type-edit',
  templateUrl: './damage-type-edit.component.html',
  styleUrls: ['./damage-type-edit.component.scss']
})
export class DamageTypeEditComponent implements OnInit {
  color: string = null;
  name: string = null;

  @Input() popupMode = false;
  @Input() type: DamageTypeType = null;
  @Input() newButtonText = 'Add new';

  selectedType: DamageTypeType;

  constructor(private damageTypeService: DamageTypeService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.selectedType = this.type ? this.type : DamageTypeType.DamageType;
  }

  onSubmit() {
    this.damageTypeService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.name,
      color: this.color,
      type: this.selectedType
    });

    if (!this.popupMode) {
      this.router.navigate(['/setup-damage-types']);
    }
  }

}
