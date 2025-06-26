import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerForm } from 'src/app/form/answer.form';
import { Answer } from 'src/app/interface/answer';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ModaleComponent } from '../modale/modale.component';
import { Result } from 'src/app/interface/result';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css']
})
export class AnswerComponent implements OnInit {
  questionId: number;
  id: number;
  answer: Answer;
  answerTitle: string;

  results: Result[] = [];
  resultsChecked: number;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  lang: string = null;

  form: AnswerForm;
  formData: FormGroup;

  formError: string = null;

  editing: boolean = false;
  editingResults: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.questionId = params.id;
      this.id = params.answerId;

      this.displayedColumns = ['checked', 'desc', 'cartone'];
      this.columnLabels = [
        {
          id: 'checked',
          label: ''
        },
        {
          id: 'desc',
          label: 'Descrizione'
        },
        {
          id: 'cartone',
          label: 'Cartone'
        }
      ];

      this.getAnswer(false);
    });
  }

  initForm() {
    this.form = new AnswerForm(this);
    this.formData = this.form.form;
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  getFilteredDisplayedColumns() {
    return this.displayedColumns.filter(el => el != 'checked')
  }

  getAnswer(initForm: boolean = true) {
    this.quizService.getAnswer(this.id).subscribe((result: any) => {
      this.answer = this.quizMapper.mapAnswer(result);
      if (initForm) this.initForm();

      this.results = [];
      this.quizService.getResultsForAnswer().subscribe((res: any) => {
        this.results = res.map(el => this.quizMapper.mapResultForAnswer(el, this.id));

        this.dataSource = new MatTableDataSource();

        this.populateDataSource();

        //se non vengo da onInit lang è già stato impostato
        if (initForm) this.setDynamicFieldsDataSource();
      })
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.results.forEach(result => {
      this.dataSource.data.push({
        id: result.id,
        checked: result.checked
      });
    });
    this.resultsChecked = this.results.filter(el => el.checked).length;
  }

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();
    this.setDynamicFieldsDataSource();
  }

  setDynamicFieldsDataSource() {
    this.dataSource.data.forEach(el => {
      el.desc = this.results.find(r => r.id == el.id)['desc_' + this.lang];
      el.cartone = this.results.find(r => r.id == el.id)['cartone_' + this.lang];
    })
  }

  confirm() {
    if (this.formData.valid) {
      this.formError = null;
      if (this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.edit())
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

  confirmResults() {
    if (this.dataSource.data.filter(el => el.checked).length > 0) {
      this.formError = null;
      if (this.areResultsModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.editResults())
          },
          autoFocus: false,
          restoreFocus: false,
          disableClose: true
        })
      } else {
        this.editingResults = false;
      }
    } else {
      this.formError = 'Selezionare almeno un risultato associato.';
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }
  }

  disableConfirmResults() {
    return this.dataSource.data.filter(el => el.checked).length == 0;
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

  cancelResults() {
    if (this.areResultsModified()) {
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

    return this.isModifiedValue(this.formData.value.desc, this.answer['desc_' + this.lang]);
  }

  areResultsModified() {
    return this.dataSource.data.filter(el => el.checked).length != this.resultsChecked;
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getAnswer();
    this.editing = false;
    this.formError = null;
  }

  edit() {
    this.answer['desc_' + this.lang] = this.formData.value.desc;
    this.quizService.editAnswer(this.answer, this.id).subscribe((res: any) => {
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
        this.getAnswer();
      })
    }, (error) => {
      this.onError(error);
    })
  }

  editResults() {
    this.quizService.editAnswerResults(this.dataSource.data.filter(el => el.checked).map(el => el.id), this.id).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.editingResults = false;
        this.getAnswer();
      })
    }, (error) => {
      this.onError(error);
    });
  }

  onError(error: any) {
    console.error(error);
    this.formError = error.error.message || error.message;
    this.cdr.detectChanges();
    window.scrollTo(0, 0);
  }

}
