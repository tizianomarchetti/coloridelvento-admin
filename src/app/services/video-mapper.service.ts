import { Injectable } from '@angular/core';
import { Video } from '../interface/video';

@Injectable({
  providedIn: 'root'
})
export class VideoMapperService {

  constructor() { }

  mapVideo(item: any): Video {
    return {
      id: item['ID'],
      title: item['TITOLO'],
      url: item['URL'],
      thumbnail: item['MINIATURA'],
      cover: item['FLAG_COPERTINA'] == 1 ? true : false
    }
  }
}
