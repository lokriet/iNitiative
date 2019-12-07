import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

export const FILTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FilterPopupComponent),
  multi: true,
};


enum FilterType {
  String = 'string',
  Dates = 'dates',
  List = 'list'
}

export interface DateFilterValue {
  minDate: Date;
  maxDate: Date;
}

@Component({
  selector: 'app-filter-popup',
  templateUrl: './filter-popup.component.html',
  styleUrls: ['./filter-popup.component.scss'],
  providers: [FILTER_VALUE_ACCESSOR]
})
export class FilterPopupComponent implements ControlValueAccessor, OnInit {
  filterIcon = faFilter;

  @ViewChild('filterContainer') filterContainer: ElementRef;

  showPopup = false;

  @Input() filterType: FilterType = FilterType.Dates;
  @Input() listItems: any[];
  @Input() listItemLabelField: string;

  stringFilterValue: string;

  minDateFilterValue: string;
  maxDateFilterValue: string;

  listFilterValue: boolean[];

  popupRightShift: string;

  value: any;
  onChange: any = () => { };

  constructor() { }

  ngOnInit() {
    if (this.filterType === FilterType.List && !!this.listItems) {
      this.listFilterValue = Array(this.listItems.length).fill(false);
    }
  }

  isFilterValueEmpty() {
    switch (this.filterType) {
      case FilterType.String:
        return !this.value;
      case FilterType.Dates:
        return !this.value || (!this.value.minDate && !this.value.maxDate);
      case FilterType.List:
        return !this.value || this.value.length === 0;
    }
  }

  onSwitchShowingPopup(event) {
    this.showPopup = !this.showPopup;
    event.stopPropagation();

    if (this.showPopup) {
      this.popupRightShift = this.getRightShift() + 'px';
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

  onClearStringFilterValue() {
    this.stringFilterValue = null;
    this.onApplyStringFilterValue();
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

  onClearDatesFilterValue() {
    this.minDateFilterValue = null;
    this.maxDateFilterValue = null;
    this.onApplyDatesFilterValue();
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

  onClearListFilterValue() {
    if (this.filterType === FilterType.List && !!this.listItems) {
      this.listFilterValue = Array(this.listItems.length).fill(false);
    }
    this.onApplyListFilterValue();
  }

  onApplyListFilterValue() {
    this.value = null;
    if (this.listItems) {
      this.value = [];
      for (let i = 0; i < this.listItems.length; i++) {
        if (this.listFilterValue[i]) {
          this.value.push(this.listItems[i]);
        }
      }
    }
    this.showPopup = false;
    this.onChange(this.value);
  }

  onCancelChangingListFilterValue() {
    if (this.value && this.listItems) {
      for (let i = 0; i < this.listItems.length; i++) {
        this.listFilterValue[i] = this.value.includes(this.listItems[i]);
      }
    }
    this.showPopup = false;
  }

  dateToString(date: Date): string {
    return date ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` : null;
  }

  stringToDate(str: string): Date {
    return str ? new Date(str) : null;
  }


  onCheckboxClicked(checked, i) {
    console.log(`checkbox clicked ${checked} ${i}`);
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
