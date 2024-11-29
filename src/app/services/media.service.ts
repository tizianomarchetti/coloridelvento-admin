import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { Video } from '../interface/video';
import { Photo } from '../interface/photo';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  photosUrl: string = ROOT + 'media/photo/getAll';
  bulkDeletePhotoUrl: string = ROOT + 'media/photo/delete';
  bulkUpdatePhotoUrl: string = ROOT + 'media/photo/update';
  bulkCreatePhotoUrl: string = ROOT + 'media/photo/create';

  videosUrl: string = ROOT + 'media/video/getAll';
  videoUrl: string = ROOT + 'media/video/getById';
  updateVideoUrl: string = ROOT + 'media/video/update';
  createVideoUrl: string = ROOT + 'media/video/create';
  bulkDeleteVideoUrl: string = ROOT + 'media/video/delete';

  editLogoUrl: string = ROOT + 'media/updateLogo';
  editCoverUrl: string = ROOT + 'media/updateCover';

  getImageUrl: string = ROOT + 'media/getImage';

  constructor(private http: HttpClient) { }

  // photo

  getPhotos() {
    return this.http.get(this.photosUrl);
  }

  bulkDeletePhoto(ids: number[]) {
    return this.http.put(this.bulkDeletePhotoUrl, { ids });
  }

  bulkUpdatePhoto(photos: Photo[]) {
    return this.http.put(this.bulkUpdatePhotoUrl, { photos });
  }

  bulkCreatePhoto(photos: Photo[], images: any[]) {
    return this.http.post(this.bulkCreatePhotoUrl, { photos, images });
  }

  // video

  getVideos() {
    return this.http.get(this.videosUrl);
  }

  getVideo(id: number) {
    return this.http.post(this.videoUrl, { id: id });
  }

  editVideo(video: Video, id: number, image: any, oldImage: string) {
    return this.http.put(this.updateVideoUrl, { 
        video: {
          ...video,
          id: id
        },
        image,
        oldImage
      });
  }

  createVideo(video: Video, image: any) {
    return this.http.post(this.createVideoUrl, { video, image });
  }

  bulkDeleteVideo(ids: number[]) {
    return this.http.put(this.bulkDeleteVideoUrl, { ids });
  }

  // logo

  editLogo(image: any) {
    return this.http.put(this.editLogoUrl, { image });
  }

  // cover

  editCover(image: any) {
    return this.http.put(this.editCoverUrl, { image });
  }

  // common

  getImage(image: string) {
    return this.http.post(
      this.getImageUrl,
      { image },
      { 
        responseType: 'blob' as 'json', 
        headers: { 'Cache-Control': 'no-cache' } 
      }
    );
  }
}
