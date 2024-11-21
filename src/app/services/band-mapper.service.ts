import { Injectable } from '@angular/core';
import { BandComponent } from '../interface/component';
@Injectable({
  providedIn: 'root'
})
export class BandMapperService {

  constructor() { }

  mapComponent(item: any): BandComponent {
    return {
      id: item['ID'],
      name: item['NOME'],
      img: item['FOTO'],
      bio: item['BIO']
    }
  }
}
