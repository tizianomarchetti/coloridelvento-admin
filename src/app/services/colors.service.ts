import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private getColorsUrl: string = ROOT + 'colors/getAll';
  private saveUrl: string = ROOT + 'colors/save';

  constructor(private http: HttpClient) { }

  getColors() {
    return this.http.get(this.getColorsUrl);
  }

  save(colorGroup: any) {
    return this.http.put(this.saveUrl, { colorGroup });
  }
}
