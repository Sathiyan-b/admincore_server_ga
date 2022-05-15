import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'filter'
})

@Injectable()

export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string, fieldName: string): any[] {
    if (!items) return [];
    if (searchText == "" || searchText == null) return items;
    return items.filter(it => it[fieldName].toLowerCase().indexOf(searchText.toLowerCase()) != -1);
  }
}
