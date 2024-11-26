import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Video } from 'src/app/interface/video';
import { VideoMapperService } from 'src/app/services/video-mapper.service';
import { VideoService } from 'src/app/services/video.service';
import { ModaleComponent } from '../modale/modale.component';
import { VideoForm } from 'src/app/form/video.form';
import { IFormComponent } from 'src/app/interface/i-form-component';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, IFormComponent {
  id: number;
  video: Video;

  columnLabels: any[] = [];

  image: any;

  isInsert: boolean;

  form: VideoForm;
  formData: FormGroup;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['criterio', 'valore'];

  formError: string = null;

  editing: boolean = false;
  insertCompleted: boolean = false;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private videoService: VideoService, 
    private videoMapper: VideoMapperService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.columnLabels = [
      {
        id: 'title',
        label: 'Titolo'
      },
      {
        id: 'url',
        label: 'URL'
      },
      {
        id: 'thumbnail',
        label: 'Miniatura'
      },
      {
        id: 'cover',
        label: 'Flag cover'
      }
    ];
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.isInsert = !this.id;

      if (this.isInsert) {
        this.initForm();
      } else {
        this.getVideo();
      }
    });
  }

  initForm() {
    this.form = new VideoForm(this);
    this.formData = this.form.form;
  }

  getVideo() {
    this.dataSource = new MatTableDataSource();
    this.videoService.getVideo(this.id).subscribe((video: any) => {
      this.video = this.videoMapper.mapVideo(video);
      this.initForm();
      this.setDataSource();
    })
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
          this.formData.get('thumbnail').setErrors({ format: true });
        }
        else {
          this.image = reader.result;
        }
      }
    }
    this.formData.controls['thumbnail'].setValue(file ? file.name : null); // <-- Set Value for Validation
  }

  setDataSource() {
    this.dataSource = new MatTableDataSource();

    Object.keys(this.video).forEach(k => {
      if (k != 'id') {
        this.dataSource.data.push({
          criterio: k,
          valore: this.video[k]
        })
      }
    });
    console.log(this.dataSource.data)
  }

  formatField(element, col) {
    if (col == 'valore') {
      if (element.criterio == 'cover') {
        return element.valore ? 'Sì' : 'No';
      } 
      else return element.valore || '-';
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
      if (this.isInsert || this.isFormModified()) {
        this.dialog.open(ModaleComponent, {
          data: {
            body: "Procedere al salvataggio?",
            onConfirm: () => (this.isInsert ? this.create(this.formData.value) : this.edit(this.formData.value))
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
    console.log(this.formData.value, this.video)
    let modified: boolean = false;
    if (this.insertCompleted)
      return false;
    if (this.isInsert) {
      return Object.keys(this.formData.controls).some(ctrl => this.formData.get(ctrl).value && this.formData.get(ctrl).value != '')
    }
    Object.keys(this.formData.value).forEach(k => {
      if (this.isModifiedValue(this.formData.value[k], this.video[k] || null))
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
    this.isInsert ? this.initForm() : this.getVideo();
    this.editing = false;
    this.formError = null;
  }

  create(video: Video) {
    this.videoService.create(video, this.image).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.insertCompleted = true;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.navigate([res.created], { relativeTo: this.route.parent });
      })
    }, (error) => {
      console.error(error);
      this.formError = error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  edit(video: Video) {
    this.videoService.edit(video, this.id, this.image, this.video.thumbnail).subscribe((res: any) => {
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
        this.getVideo();
        this.setDataSource();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  delete() {
    const ids: number[] = [this.id];
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere all'eliminazione del video?",
        onConfirm: () => {
          this.doDelete(ids);
        }
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    })
  }

  doDelete(ids: number[]) {
    this.videoService.bulkDelete(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.router.navigate(['/videos'])
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
