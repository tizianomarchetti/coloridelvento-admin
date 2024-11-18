import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl: string = ROOT + 'user/getById';
  private acceptUrl: string = ROOT + 'accept';
  private refuseUrl: string = ROOT + 'refuse';
  private checkPasswordUrl: string = ROOT + 'user/checkPassword';
  private editPasswordUrl: string = ROOT + 'user/editPassword';

  constructor(private http: HttpClient) { }

  getById(id: number) {
    return this.http.post(this.userUrl, { id: id });
  } 

  accept(id: number, asAdmin: boolean) {
    return this.http.put(this.acceptUrl, { id: id, asAdmin: asAdmin });
  }

  refuse(id: number) {
    return this.http.put(this.refuseUrl, { id: id });
  }

  checkPassword(id: number, password: string) {
    return this.http.post(this.checkPasswordUrl, { id: id, password: password });
  }

  editPassword(id: number, password: string) {
    return this.http.put(this.editPasswordUrl, { id: id, password: password });
  }

}