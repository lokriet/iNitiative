import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';


export const COLOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorsPopupComponent),
  multi: true,
};


@Component({
  selector: 'app-colors-popup',
  templateUrl: './colors-popup.component.html',
  styleUrls: ['./colors-popup.component.scss'],
  providers: [COLOR_VALUE_ACCESSOR]
})
export class ColorsPopupComponent implements ControlValueAccessor {
  checkboxIcon = faCheck;
  noColorIcon = faBan;

  selectedColor = null;

  showPopup = false;

  colors = [
    '#f6402c',
    '#eb1460',
    '#9c1ab1',
    '#6633b9',
    '#3d4db7',
    '#46af4a',
    '#009687',
    '#00bbd5',
    '#00a6f6',
    '#1093f5',
    '#88c440',
    '#ccdd1e',
    '#ffec16',
    '#ffc100',
    '#ff9800',
    '#000000',
    '#5e7c8b',
    '#9d9d9d',
    '#7a5547',
    '#ff5505'
  ];

  onChange: any = () => { };

  constructor() { }

  onSelectColor(colorOption) {
    this.selectedColor = colorOption;
    this.showPopup = false;
    this.onChange(this.selectedColor);
  }

  onSwitchColorSelector() {
    this.showPopup = !this.showPopup;
  }

  onCloseColorSelector() {
    this.showPopup = false;
  }

  writeValue(color: string): void {
    this.selectedColor = color;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

}
