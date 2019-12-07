import { Component, OnInit } from '@angular/core';

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
  type = DamageTypeType.DamageType;

  constructor(private damageTypeService: DamageTypeService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.damageTypeService.add({
      id: guid(),
      owner: this.authService.user.uid,
      name: this.name,
      color: this.color,
      type: this.type
    });

    this.router.navigate(['/setup-damage-types']);
  }

}
