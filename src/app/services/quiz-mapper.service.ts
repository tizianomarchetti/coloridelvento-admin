import { Injectable } from '@angular/core';
import { Result } from '../interface/result';
import { Question } from '../interface/question';
import { Answer } from '../interface/answer';

@Injectable({
  providedIn: 'root'
})
export class QuizMapperService {

  constructor() { }

  mapResult(item: any): Result {
    return {
      id: item['ID'],
      desc_it: item['DESCRIZIONE_IT'],
      desc_en: item['DESCRIZIONE_EN'],
      cartone_it: item['CARTONE_IT'],
      cartone_en: item['CARTONE_EN'],
      text_it: item['TESTO_IT'],
      text_en: item['TESTO_EN'],
      img: item['IMMAGINE']
    }
  }

   mapResultForAnswer(item: any, idRisposta: number): Result {
    return {
      id: item['ID'],
      desc_it: item['DESCRIZIONE_IT'],
      desc_en: item['DESCRIZIONE_EN'],
      cartone_it: item['CARTONE_IT'],
      cartone_en: item['CARTONE_EN'],
      text_it: item['TESTO_IT'],
      text_en: item['TESTO_EN'],
      img: item['IMMAGINE'],
      fkRisposta: item['FK_RISPOSTA'],
      checked: item['FK_RISPOSTA'] == idRisposta
    }
  }

  mapQuestion(item: any): Question {
    return {
      id: item['ID'],
      title_it: item['TITOLO_IT'],
      title_en: item['TITOLO_EN']
    }
  }

  mapAnswer(item: any): Answer {
    return {
      id: item['ID'],
      valore: item['VALORE'],
      desc_it: item['DESCRIZIONE_IT'],
      desc_en: item['DESCRIZIONE_EN'],
      question: item['FK_DOMANDA'],
    }
  }
}
