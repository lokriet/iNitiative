import { Component, OnInit } from '@angular/core';
import { DamageTypeType } from '../state/damage-type/damage-type.model';

@Component({
  selector: 'app-damage-type-setup',
  templateUrl: './damage-type-setup.component.html',
  styleUrls: ['./damage-type-setup.component.scss']
})
export class DamageTypeSetupComponent implements OnInit {
  damageTypes = DamageTypeType.DamageType;
  effects = DamageTypeType.Effect;

  ngOnInit(): void {
  }
  
}
