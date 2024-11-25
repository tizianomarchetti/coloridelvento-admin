import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { Video } from '../interface/video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  videosUrl: string = ROOT + 'video/getAll';
  videoUrl: string = ROOT + 'video/getById';
  updateUrl: string = ROOT + 'video/update';
  createUrl: string = ROOT + 'video/create';
  bulkDeleteUrl: string = ROOT + 'video/delete';

  constructor(private http: HttpClient) { }

  getVideos() {
    return this.http.get(this.videosUrl);
  }

  getVideo(id: number) {
    return this.http.post(this.videoUrl, { id: id });
  }

  edit(video: Video, id: number, image: any, oldImage: string) {
    return this.http.put(this.updateUrl, { 
        video: {
          ...video,
          id: id
        },
        image,
        oldImage
      });
  }

  create(video: Video, image: any) {
    return this.http.post(this.createUrl, { video, image });
  }

  bulkDelete(ids: number[]) {
    return this.http.put(this.bulkDeleteUrl, { ids });
  }
}
