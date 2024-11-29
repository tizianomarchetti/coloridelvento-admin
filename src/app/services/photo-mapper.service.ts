import { Injectable } from '@angular/core';
import { Photo } from '../interface/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoMapperService {

  constructor() { }

  mapPhoto(item: any): Photo {
    return {
      id: item['ID'],
      title: item['TITOLO'],
      cover: item['FLAG_COPERTINA'] == 1,
      order: item['ORDINE']
    }
  }
}
