import { Component, ElementRef, forwardRef, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export const FILTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilterPopupComponent),
  multi: true,
};


enum FilterType {
  String = 'string',
  Dates = 'dates'
}

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss'],
  providers: [FILTER_VALUE_ACCESSOR]
})
export class FilterPopupComponent implements ControlValueAccessor {
  filterIcon = faFilter;

  @ViewChild('filterContainer') filterContainer: ElementRef;

  showPopup = false;

  @Input() filterType: FilterType = FilterType.Dates;

  stringFilterValue: string;
  minDateFilterValue: string;
  maxDateFilterValue: string;

  rightShift: string;

  value: any;
  onChange: any = () => { };

  constructor() { }

  isFilterValueEmpty() {
    switch (this.filterType) {
      case FilterType.String:
        return !this.value;
      case FilterType.Dates:
        return !this.value || (!this.value.minDate && !this.value.maxDate);
    }
  }

  onSwitchShowingPopup(event) {
    this.showPopup = !this.showPopup;
    event.stopPropagation();

    if (this.showPopup) {
      this.rightShift = this.getRightShift() + 'px';
    }
  }

  getRightShift(): number {
    const windowWidth = document.documentElement.clientWidth;
    const filterContainer = (this.filterContainer.nativeElement as HTMLElement);
    const popupRightSide = filterContainer.getBoundingClientRect().right + 250;
    let rightShift = 0;
    if (popupRightSide > windowWidth) {
      rightShift = popupRightSide - windowWidth;
    }

    return rightShift;
  }

  onApplyStringFilterValue() {
    this.value = this.stringFilterValue;
    this.showPopup = false;
    this.onChange(this.value);
  }

  onCancelChangingStringFilterValue() {
    this.stringFilterValue = this.value;
    this.showPopup = false;
  }

  onApplyDatesFilterValue() {
    let minDate = null;
    let maxDate = null;
    if (this.minDateFilterValue && this.minDateFilterValue.length > 0) {
      minDate = this.stringToDate(this.minDateFilterValue);
      maxDate = this.stringToDate(this.maxDateFilterValue);
    }

    this.value = {minDate, maxDate};
    this.showPopup = false;
    this.onChange(this.value);
  }

  onCancelChangingDatesFilterValue() {
    if (this.value) {
      this.minDateFilterValue = this.dateToString(this.value.minDate);
      this.maxDateFilterValue = this.dateToString(this.value.maxDate);
    } else {
      this.minDateFilterValue = null;
      this.maxDateFilterValue = null;
    }
    this.showPopup = false;
  }

  dateToString(date: Date): string {
    return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : null;
  }

  stringToDate(str: string): Date {
    return str ? new Date(str) : null;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }

}
