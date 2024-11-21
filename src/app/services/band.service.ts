import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { HttpClient } from '@angular/common/http';
import { BandComponent } from '../interface/component';

@Injectable({
  providedIn: 'root'
})
export class BandService {
  componentsUrl: string = ROOT + 'component/getAll';
  componentUrl: string = ROOT + 'component/getById';
  updateComponentUrl: string = ROOT + 'component/update';
  createComponentUrl: string = ROOT + 'component/create';
  bulkDeleteUrl: string = ROOT + 'component/delete';

  constructor(private http: HttpClient) { }

  getComponents() {
    return this.http.get(this.componentsUrl);
  }

  getComponent(id: number) {
    return this.http.post(this.componentUrl, { id: id });
  }

  editComponent(component: BandComponent, id: number, image: any, dictionary: any, lang: string, oldImage: string) {
    return this.http.put(this.updateComponentUrl, { 
        component: {
          ...component,
          id: id
        },
        image,
        dictionary,
        lang,
        oldImage
      });
  }

  createComponent(component: BandComponent, image: any, dictionary: any, lang: string) {
    return this.http.post(this.createComponentUrl, { component, image, dictionary, lang });
  }

  bulkDeleteComponents(ids: number[]) {
    return this.http.put(this.bulkDeleteUrl, { ids: ids });
  }
}
