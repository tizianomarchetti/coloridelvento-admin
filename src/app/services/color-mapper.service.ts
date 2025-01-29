import { Injectable } from '@angular/core';
import { ColorGroup } from '../interface/color-group';

@Injectable({
  providedIn: 'root'
})
export class ColorMapperService {

  constructor() { }

  mapColorGroup(item: any[]): ColorGroup {
    return {
      header: item.find(el => el['TITOLO'] == 'main-bg')['VALORE'],
      headerGradient: item.find(el => el['TITOLO'] == 'main-bg')['VALORE'].includes('gradient'),
      footer: item.find(el => el['TITOLO'] == 'footer-bg')['VALORE'],
      footerGradient: item.find(el => el['TITOLO'] == 'footer-bg')['VALORE'].includes('gradient'),
      btn: item.find(el => el['TITOLO'] == 'btn-bg')['VALORE'],
      btnGradient: item.find(el => el['TITOLO'] == 'btn-bg')['VALORE'].includes('gradient'),
      link: item.find(el => el['TITOLO'] == 'link-color')['VALORE']
    }
  }
}
