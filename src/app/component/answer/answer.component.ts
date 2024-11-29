import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerForm } from 'src/app/form/answer.form';
import { Answer } from 'src/app/interface/answer';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ModaleComponent } from '../modale/modale.component';

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

  lang: string = null;

  form: AnswerForm;
  formData: FormGroup;

  formError: string = null;

  editing: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.questionId = params.id;
      this.id = params.answerId;

      this.getAnswer(false);
    });
  }

  initForm() {
    this.form = new AnswerForm(this);
    this.formData = this.form.form;
  }

  getAnswer(initForm: boolean = true) {
    this.quizService.getAnswer(this.id).subscribe((result: any) => {
      this.answer = this.quizMapper.mapAnswer(result);
      if (initForm) this.initForm();
    })
  }

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();
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

    return this.isModifiedValue(this.formData.value.desc, this.answer['desc_' + this.lang]);
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
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
