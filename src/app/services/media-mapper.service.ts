import { Injectable } from '@angular/core';
import { Photo } from '../interface/photo';
import { Video } from '../interface/video';

@Injectable({
  providedIn: 'root'
})
export class MediaMapperService {

  constructor() { }

  mapPhoto(item: any): Photo {
    return {
      id: item['ID'],
      title: item['TITOLO'],
      cover: item['FLAG_COPERTINA'] == 1,
      order: item['ORDINE']
    }
  }

  mapVideo(item: any): Video {
    return {
      id: item['ID'],
      title: item['TITOLO'],
      url: item['URL'],
      thumbnail: item['MINIATURA'],
      cover: item['FLAG_COPERTINA'] == 1
    }
  }
}
