import { Injectable } from '@angular/core';
import { Contatto } from '../interface/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactMapperService {

  constructor() { }

  mapContact(item: any): Contatto {
    return {
      id: item['ID'],
      name: item['NOME_CONTATTO'],
      desc: item['DESCRIZIONE'],
      type: {
        url: item['URL'],
        icon: item['ICONA'],
        color: item['COLORE']
      },
      footer: item['FLAG_FOOTER'] == 1
    }
  }
}
