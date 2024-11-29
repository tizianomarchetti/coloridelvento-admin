import { Injectable } from '@angular/core';
import { Contatto } from '../interface/contact';
import { FormContatto } from '../interface/contact-form';
import { Social } from '../interface/social';

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

  mapContactForm(item: any[]): FormContatto {
    return {
      email: item.find(el => el['TITOLO'] == 'mailto')['VALORE'],
      subject: item.find(el => el['TITOLO'] == 'subject')['VALORE']
    }
  }

  mapSocial(item: any): Social {
    return {
      id: item['ID'],
      type: {
        url: item['URL'],
        icon: item['ICONA']
      }
    }
  }
}
