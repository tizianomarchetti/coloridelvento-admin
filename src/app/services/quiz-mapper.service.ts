import { Injectable } from '@angular/core';
import { Result } from '../interface/result';

@Injectable({
  providedIn: 'root'
})
export class QuizMapperService {

  constructor() { }

  mapResult(item: any): Result {
    return {
      id: item['ID'],
      most_answers: item['MAGGIORANZA_RISPOSTE'],
      img: item['IMMAGINE']
    }
  }
}
