import { Injectable } from '@angular/core';
import { Utente } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserMapperService {

  constructor() { }

  mapUtente(item: any): Utente {
    return {
      id: item['ID'],
      email: item['EMAIL'],
      password: item['PASSWORD'],
      active: item['ACTIVE'] == 1,
      admin: item['ADMIN'] == 1,
      token: item['TOKEN']
    }
  }
}
