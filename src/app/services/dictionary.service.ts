import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROOT } from '../config/Constants';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private getDictionaryUrl: string = ROOT + 'dictionary/getDictionary';
  private saveDictionaryUrl: string = ROOT + 'dictionary/save';

  constructor(private http: HttpClient) { }

  getDictionary(lang: string) {
    return this.http.post(this.getDictionaryUrl, { lang });
  }

  save(lang: string, dictionary: any) {
    return this.http.put(this.saveDictionaryUrl, { lang, dictionary });
  }
}
