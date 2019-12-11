import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByname'
})
export class FilterByNamePipe implements PipeTransform {

  transform(value: any[], filter: string): any {
    if (!value && value.length === 0) {
      return value;
    }

    if (!filter || filter.length === 0) {
      return value;
    }

    return value.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()));
  }

}
