import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';
import { Result } from '../interface/result';
import { Question } from '../interface/question';
import { Answer } from '../interface/answer';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  resultsUrl: string = ROOT + 'quiz/result/getAll';
  resultsForAnswerUrl: string = ROOT + 'quiz/result/getAllForAnswer';
  resultUrl: string = ROOT + 'quiz/result/getById';
  updateResultUrl: string = ROOT + 'quiz/result/update';

  questionsUrl: string = ROOT + 'quiz/question/getAll';
  questionUrl: string = ROOT + 'quiz/question/getById';
  updateQuestionUrl: string = ROOT + 'quiz/question/update';

  answersUrl: string = ROOT + 'quiz/answer/getAll';
  answerUrl: string = ROOT + 'quiz/answer/getById';
  updateAnswerUrl: string = ROOT + 'quiz/answer/update';
  updateAnswerResultsUrl: string = ROOT + 'quiz/answer/updateResults';

  constructor(private http: HttpClient) { }

  getResults() {
    return this.http.get(this.resultsUrl);
  }

  getResultsForAnswer(answerId: number) {
    return this.http.get(this.resultsForAnswerUrl, { params: { answerId: answerId.toString() } });
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

  getQuestions() {
    return this.http.get(this.questionsUrl);
  }

  getQuestion(id: number) {
    return this.http.post(this.questionUrl, { id });
  }

  editQuestion(question: Question, id: number) {
    return this.http.put(this.updateQuestionUrl, { question, id });
  }

  getAnswers(id: number) {
    return this.http.post(this.answersUrl, { id });
  }

  getAnswer(id: number) {
    return this.http.post(this.answerUrl, { id });
  }

  editAnswer(answer: Answer, id: number) {
    return this.http.put(this.updateAnswerUrl, { answer, id });
  }

  editAnswerResults(results: Result[], answerId: number) {
    return this.http.put(this.updateAnswerResultsUrl, { answerId, results });
  }
}
