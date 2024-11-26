import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { IFormComponent } from 'src/app/interface/i-form-component';
import { ModaleComponent } from '../modale/modale.component';
import { QuizMainPage } from 'src/app/interface/quiz-main-page';
import { QuizMainPageForm } from 'src/app/form/quiz-main-page.form';
import { DictionaryService } from 'src/app/services/dictionary.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit, IFormComponent {
  lang: string = null;

  dictionary: any = null;

  quizPage: QuizMainPage;

  columnLabels: any[] = [];

  form: QuizMainPageForm;
  formData: FormGroup;

  formError: string = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  editing: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private dictService: DictionaryService, 
    private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'description',
        label: 'Descrizione'
      },
      {
        id: 'disclaimer',
        label: 'Disclaimer'
      }
    ];
  }

  setLang(lang: string) {
    this.lang = lang;
    this.getDictionary();
  }

  initForm() {
    this.form = new QuizMainPageForm(this);
    this.formData = this.form.form;
  }

  getDictionary() {
    this.dictService.getDictionary(this.lang).subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);
      this.quizPage = new QuizMainPage();
      this.quizPage.description = this.dictionary.section.test.description || '';
      this.quizPage.disclaimer = this.dictionary.section.test.disclaimer || '';
      this.initForm();
      this.setDataSource();
    });
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.quizPage).forEach(k => {
      this.dataSource.data.push({
        criterio: k,
        valore: this.quizPage[k]
      })
    });
  }

  formatField(element, col) {
    if (col == 'valore') {
      return element.valore || '-';
    }
    else {
      if (element.criterio)
        return this.columnLabels.find(el => el.id == element.criterio).label
    }
    return element[col] || '-';
  }

  confirm() {
    if (this.formData.valid) {
      this.formError = null;
      if (this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.save())
          },
          autoFocus: false,
          restoreFocus: false,
          disableClose: true
        })
      } else {
        this.editing = false;
      }
    } else {
      this.formError = 'Compilare correttamente tutti i campi obbligatori.';
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }
  }

  cancel() {
    if (this.isFormModified()) {
      this.dialog.open(ModaleComponent, {
        data: {
          body: "Tornare indietro? Le modifiche verranno perse.",
          onConfirm: () => {
            this.onCancel();
          }
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      })
    } else {
      this.onCancel();
    }
  }

  isFormModified() {
    if (!this.formData) return false;
    
    let modified: boolean = false;
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.quizPage[k] || null))
        modified = true;
    })
    
    return modified;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getDictionary();
    this.editing = false;
    this.formError = null;
  }

  save() {
    this.dictionary.section.test.description = this.formData.get('description').value;
    this.dictionary.section.test.disclaimer = this.formData.get('disclaimer').value;
    this.dictService.save(this.lang, this.dictionary).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.editing = false;
        this.getDictionary();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
