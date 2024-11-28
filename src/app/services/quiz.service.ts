import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { Result } from '../interface/result';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  resultsUrl: string = ROOT + 'quiz/result/getAll';
  resultUrl: string = ROOT + 'quiz/result/getById';
  updateResultUrl: string = ROOT + 'quiz/result/update';

  constructor(private http: HttpClient) { }

  getResults() {
    return this.http.get(this.resultsUrl);
  }

  getResult(id: number) {
    return this.http.post(this.resultUrl, { id });
  }

  editResult(result: Result, id: number, image: any, dictionary: any, lang: string, oldImage: string) {
    return this.http.put(this.updateResultUrl, { 
        result: {
          ...result,
          id: id
        },
        image,
        dictionary,
        lang,
        oldImage
      });
  }
}
