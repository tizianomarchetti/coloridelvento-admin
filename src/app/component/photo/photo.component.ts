import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange, MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoForm } from 'src/app/form/photo.form';
import { PhotoService } from 'src/app/services/photo.service';
import { ModaleComponent } from '../modale/modale.component';
import { IFormComponent } from 'src/app/interface/i-form-component';
import { Photo } from 'src/app/interface/photo';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.css']
})
export class PhotoComponent implements OnInit, IFormComponent {
  images: any[] = [];
  modaleSrc: string;
  formatErrors: boolean = false;

  form: PhotoForm;
  formData: FormGroup;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  checkableLength: number;

  formError: string = null;

  insertCompleted: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private photoService: PhotoService, 
    private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.displayedColumns = ['title', 'cover', 'action'];
    this.columnLabels = [
      {
        id: 'title',
        label: 'Foto'
      },
      {
        id: 'cover',
        label: 'Flag cover'
      },
      {
        id: 'action',
        label: 'Azioni'
      }
    ];

    this.initForm();
  }

  initForm() {
    this.form = new PhotoForm(this);
    this.formData = this.form.form;
  }

  clickFileInput() {
    document.getElementById('file').click();
  }

  onFileChange(event: any) {
    const files = event.target.files; // <--- File Object for future use.
    if(files.length > 0) {
      this.formatErrors = false;
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = [];
      this.images = [];
      this.formData.controls['title'].setValue('');
      Array.from(files).forEach((file: File, index: number) => {
        const fileType = file.type;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (fileType != 'image/webp') {
            this.formatErrors = true;
            // this.formData.get('title').setErrors({ format: true });
          }
          else {
            this.formData.controls['title'].setValue( // <-- Set Value for Validation
            this.formData.controls['title'].value 
              ? [this.formData.controls['title'].value, file.name].join(', ')
              : file.name);
            const image = { title: [index, file.name].join('_'), file: reader.result }
            this.images.push(image);
            this.populateDataSource(image);
            this.setPaginator();
          }
        }
      });
    }
  }

  populateDataSource(image: any) {
    this.dataSource.data.push({ title: image.title, cover: false, src: image.file as string });
  }

  setPaginator() {
    if (this.paginator) {
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { 
        if (length == 0 || pageSize == 0) { return `0 di ${length}`; } 
        length = Math.max(length, 0); 
        const startIndex = page * pageSize; 
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; 
        return `${startIndex + 1} - ${endIndex} di ${length}`; 
      }
      this.dataSource.paginator = this.paginator;
    }
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  remove(element: any) {
    this.dataSource.data = this.dataSource.data.filter(el => el.title != element.title);
    this.images = this.images.filter(el => el.title != element.title);

    this.formData.controls['title'].setValue(
      this.formData.controls['title'].value.split(', ').filter(el => el != element.title.split('_')[1]).join(', ')
    );
  }

  isFormModified() {
    if (!this.formData || !this.dataSource || this.insertCompleted) return false;

    return Object.keys(this.formData.controls).some(ctrl => this.formData.get(ctrl).value && this.formData.get(ctrl).value != '')
      && this.dataSource.data && this.dataSource.data.length > 0;
  }

  confirm() {
    if (this.formData.valid && this.dataSource && this.dataSource.data.length > 0) {
      this.formError = null;
      this.dialog.open(ModaleComponent, {
        data: {
          body: "Procedere al salvataggio?",
          onConfirm: () => this.create()
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      })
    } else {
      this.formError = 'Compilare correttamente tutti i campi obbligatori.';
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    }
  }

  create() {
    let photos: Photo[] = [];
    this.dataSource.data.forEach(el => {
      photos.push({
        id: null,
        title: el.title,
        cover: el.cover,
        order: null
      })
    })
    
    this.photoService.bulkCreate(photos, this.images).subscribe((res: any) => {
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
        this.router.navigate(['/photos']);
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
