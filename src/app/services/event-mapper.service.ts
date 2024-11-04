import { Injectable } from '@angular/core';
import { Evento } from '../interface/event';

@Injectable({
  providedIn: 'root'
})
export class EventMapperService {

  constructor() { }

  mapEvent(item: any): Evento {
    return {
      id: item['ID'],
      location: item['LUOGO'],
      date: item['DATA'],//this.formatDateFromBe(item['DATA']),
      time: item['ORA']// ? this.formatTimeFromBe(item['ORA']) : null
    }
  }

  formatDateFromBe(date: string): string {
    return date.split('-').reverse().join('/');
  }

  formatTimeFromBe(time: string): string {
    return time.split(':').slice(0, 2).join(':');
  }
}
