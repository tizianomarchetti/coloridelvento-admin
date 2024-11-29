import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/interface/question';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ModaleComponent } from '../modale/modale.component';
import { Answer } from 'src/app/interface/answer';
import { QuestionForm } from 'src/app/form/question.form';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  id: number;
  question: Question;
  questionTitle: string;

  answers: Answer[] = [];

  lang: string = null;

  form: QuestionForm;
  formData: FormGroup;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  formError: string = null;

  editing: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;

      this.displayedColumns = ['answer', 'text'];
      this.columnLabels = [
        {
          id: 'answer',
          label: 'Risposta'
        },
        {
          id: 'text',
          label: 'Testo'
        }
      ];

      this.dataSource = new MatTableDataSource();
      this.getQuestion(false);
    });
  }

  initForm() {
    this.form = new QuestionForm(this);
    this.formData = this.form.form;
  }

  getQuestion(initForm: boolean = true) {
    this.quizService.getQuestion(this.id).subscribe((result: any) => {
      this.question = this.quizMapper.mapQuestion(result);
      if (initForm) this.initForm();

      this.answers = [];
      this.quizService.getAnswers(this.id).subscribe((res: any) => {
        this.answers = res.map(el => this.quizMapper.mapAnswer(el));

        this.populateDataSource();
      })
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.answers.forEach(answer => {
      this.dataSource.data.push({
        id: answer.id,
        answer: answer.valore
      });
    });
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  navigateTo(row) {
    this.router.navigate(['answers/' + row.id], { relativeTo: this.route });
  }

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();

    this.dataSource.data.forEach(el => {
      el.text = this.answers.find(a => a.valore == el.answer)['desc_' + this.lang]
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

    return this.isModifiedValue(this.formData.value.title, this.question['title_' + this.lang]);
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getQuestion();
    this.editing = false;
    this.formError = null;
  }

  edit() {
    this.question['title_' + this.lang] = this.formData.value.title;
    this.quizService.editQuestion(this.question, this.id).subscribe((res: any) => {
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
        this.getQuestion();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
