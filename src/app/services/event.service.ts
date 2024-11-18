import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../interface/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  eventsUrl: string = ROOT + 'event/getAll';
  eventUrl: string = ROOT + 'event/getById';
  updateEventUrl: string = ROOT + 'event/update';
  createEventUrl: string = ROOT + 'event/create';
  bulkDeleteUrl: string = ROOT + 'event/delete';

  constructor(private http: HttpClient) { }

  getEvents() {
    return this.http.get(this.eventsUrl);
  }

  getEvent(id: number) {
    return this.http.post(this.eventUrl, { id: id });
  }

  edit(event: Evento, id: number) {
    return this.http.put(this.updateEventUrl, {
      ...event,
      id: id
    });
  }

  create(event: Evento) {
    return this.http.post(this.createEventUrl, event);
  }

  bulkDelete(ids: number[]) {
    return this.http.put(this.bulkDeleteUrl, { ids: ids }, { responseType: 'text'});
  }
}
