import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMapperService } from 'src/app/services/media-mapper.service';
import { MediaService } from 'src/app/services/media.service';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-single-image',
  templateUrl: './single-image.component.html',
  styleUrls: ['./single-image.component.css']
})
export class SingleImageComponent implements OnInit {
  title: string;
  imgTitle: string;

  image: any;
  imageLoaded: boolean = false;

  formError: string = null;

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private mediaService: MediaService, 
    private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.getDetail();
  }

  getDetail() {
    this.route.url.subscribe(path => {
      this.imgTitle = path[0].path + '.webp';
      this.title = path[0].path == 'logo' ? path[0].path : 'immagine di copertina'
      this.mediaService.getImage(this.imgTitle).subscribe((blob: Blob) => {        
        const reader = new FileReader();
        reader.onloadend = () => {
          this.image = reader.result;  // Base64 encoded image
        };
        reader.readAsDataURL(blob);  // Convert Blob to Base64
      })
    })
  }

  clickFileInput() {
    document.getElementById('file').click();
  }

  onFileChange(event: any) {
    this.formError = null;
    const file = event.target.files[0]; // <--- File Object for future use.
    if(event.target.files.length > 0) {
      const fileType = file.type;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (fileType != 'image/webp') {
          this.formError = 'Formato immagine non valido.';
          window.scrollTo(0, 0);
        }
        else {
          this.imgTitle = file ? file.name : null;
          this.image = reader.result;
          this.imageLoaded = true;
        }
      }
    }
  }

  confirm() {
    if (!this.formError) {
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
      }
    }
  }

  isFormModified() {
    return this.imageLoaded;
  }

  edit() {
    (this.title == 'logo' ? this.mediaService.editLogo(this.image) : this.mediaService.editCover(this.image)).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.imageLoaded = false;
        this.getDetail();
      })
    }, (error) => {
      console.error(error);
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
