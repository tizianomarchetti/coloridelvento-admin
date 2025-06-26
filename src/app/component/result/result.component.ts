import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from 'src/app/interface/result';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';
import { ModaleComponent } from '../modale/modale.component';
import { ResultForm } from 'src/app/form/result.form';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  id: number;
  result: Result;

  image: any;

  lang: string = null;

  form: ResultForm;
  formData: FormGroup;

  dictionary: any = null;

  formError: string = null;

  editing: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService, private cdr: ChangeDetectorRef, private router: Router,
    private dictService: DictionaryService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.getResult(false);
    });
  }

  initForm() {
    this.dictService.getDictionary(this.lang).subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);
      this.form = new ResultForm(this);
      this.formData = this.form.form;
    });
  }

  getResult(initForm: boolean = true) {
    this.quizService.getResult(this.id).subscribe((result: any) => {
      this.result = this.quizMapper.mapResult(result);
      if (initForm) this.initForm();
    })
  }

  setLang(lang: string) {
    this.lang = lang;
    this.initForm();
  }

  clickFileInput() {
    document.getElementById('file').click();
  }

  onFileChange(event: any) {
    const file = event.target.files[0]; // <--- File Object for future use.
    if(event.target.files.length > 0) {
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (fileType != 'image/webp') {
          this.formData.get('img').setErrors({ format: true });
        }
        else {
          this.image = reader.result;
        }
      }
    }
    this.formData.controls['img'].setValue(file ? file.name : null); // <-- Set Value for Validation
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

    return this.isModifiedValue(this.formData.value.img, this.result.img)
      || this.formData.value.desc != this.result['desc_' + this.lang]
      || this.formData.value.cartone != this.result['cartone_' + this.lang]
  }

  isModifiedValue(firstValue, secondValue) {
    if ((firstValue == '' && !secondValue) || (secondValue == '' && !firstValue))
      return false;
    return firstValue != secondValue;
  }

  onCancel() {
    this.getResult();
    this.editing = false;
    this.formError = null;
  }

  edit() {
    this.result['desc_' + this.lang] = this.formData.value.desc;
    this.result['cartone_' + this.lang] = this.formData.value.cartone;
    this.result.img = this.formData.get('img').value;
    this.quizService.editResult(this.result, this.id, this.image, this.dictionary, this.lang, this.result.img).subscribe((res: any) => {
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
        this.getResult();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
