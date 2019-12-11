import { Component, OnInit, Input } from '@angular/core';
import { faBan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-color-value',
  templateUrl: './color-value.component.html',
  styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent implements OnInit {
  noColorIcon = faBan;

  @Input() color: string = null;
  @Input() showEmpty = true;

  constructor() { }

  ngOnInit() {
  }

}
