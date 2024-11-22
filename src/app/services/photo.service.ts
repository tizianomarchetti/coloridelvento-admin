import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { Photo } from '../interface/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photosUrl: string = ROOT + 'photo/getAll';
  bulkDeleteUrl: string = ROOT + 'photo/delete';
  bulkUpdateUrl: string = ROOT + 'photo/update';
  bulkCreateUrl: string = ROOT + 'photo/create';

  constructor(private http: HttpClient) { }

  getPhotos() {
    return this.http.get(this.photosUrl);
  }

  bulkDelete(ids: number[]) {
    return this.http.put(this.bulkDeleteUrl, { ids });
  }

  bulkUpdate(photos: Photo[]) {
    return this.http.put(this.bulkUpdateUrl, { photos });
  }

  bulkCreate(photos: Photo[], images: any[]) {
    return this.http.post(this.bulkCreateUrl, { photos, images });
  }
}
