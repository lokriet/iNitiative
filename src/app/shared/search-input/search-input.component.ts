import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


export const SEARCH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchInputComponent),
  multi: true,
};

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  providers: [SEARCH_VALUE_ACCESSOR]
})
export class SearchInputComponent implements ControlValueAccessor {
  faSearch = faSearch;
  
  searchTerm: string = null;

  onChange: any = () => { };

  constructor() { }

  searchTermChanged(newSearchTerm: string) {
    this.searchTerm = newSearchTerm;
    this.onChange(this.searchTerm);
  }

  writeValue(value: string): void {
    this.searchTerm = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // do nothing
  }
}
