import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog, MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Photo } from 'src/app/interface/photo';
import { ModaleComponent } from '../modale/modale.component';
import { MediaService } from 'src/app/services/media.service';
import { MediaMapperService } from 'src/app/services/media-mapper.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  showTipCover: boolean = true;
  showTipOrder: boolean = true;

  photos: Photo[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  checkableLength: number;

  formError: string = null;

  modaleSrc: string;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private mediaService: MediaService, 
    private mediaMapper: MediaMapperService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.displayedColumns = ['checked', 'title', 'cover', 'order'];
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
        id: 'order',
        label: 'Ordine'
      }
    ];

    this.dataSource = new MatTableDataSource();

    this.getPhotos();
  }

  getPhotos() {
    this.photos = [];
    this.mediaService.getPhotos().subscribe((res: any) => {
      this.photos = res.map(el => this.mediaMapper.mapPhoto(el));

      this.populateDataSource();
      this.setPaginator();
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.photos.forEach(photo => {
      this.dataSource.data.push({...photo});
    });
    this.updateCheckableLength();
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

  updateCheckableLength() {
    this.checkableLength = this.dataSource.data.length;

    this.displayedColumns = this.checkableLength == 0 
      ? this.displayedColumns.filter(el => el != 'checked')
      : (this.displayedColumns.includes('checked') ? this.displayedColumns : ['checked', ...this.displayedColumns]);
  }

  getCheckedLength() {
    const length = this.dataSource 
      ? this.dataSource.data.filter(el => el.checked).length 
      : 0;
    return length;
  }

  isAnyCoverOrOrderModified() {
    let modified = false;
    this.photos.forEach(photo => {
      if (photo.cover != this.dataSource.data.find(el => el.id == photo.id).cover
        || photo.order != this.dataSource.data.find(el => el.id == photo.id).order)
        modified = true;
    });
    return modified;
  }

  selectAll(event: MatCheckboxChange) {
    this.dataSource.data.forEach(el => {
      el.checked = event.checked;
    });
  }

  verifyUniqueOrder() {
    let uniqueOrderValues = true;
    const seen = new Set();

    for (const el of this.dataSource.data.map(el => el.order)) {
      if (seen.has(el)) {
        uniqueOrderValues = false;
        break;
      }
      seen.add(el);
    }

    return uniqueOrderValues 
      && this.dataSource.data.every(photo => (!photo.cover && !photo.order) || (photo.cover && photo.order));
  }

  update() {
    this.formError = null;
    if (!this.verifyUniqueOrder()) {
      this.formError = 'Controlla i valori per la colonna ordine e la loro unicità';
      window.scrollTo(0, 0);
      return;
    }
    let photos: Photo[] = [];
    this.dataSource.data.forEach(photo => {
      if (photo.cover != this.photos.find(el => el.id == photo.id).cover
        || photo.order != this.photos.find(el => el.id == photo.id).order)
        photos.push(photo);
    });
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere alla modifica di " + photos.length + (photos.length == 1 ? " elemento?" : " elementi?"),
        onConfirm: () => {
          this.doUpdate(photos);
        }
      },
      autoFocus: false,
      restoreFocus: false,
      disableClose: true
    })
  }

  doUpdate(photos: Photo[]) {
    this.mediaService.bulkUpdatePhoto(photos).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.getPhotos();
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

  delete() {
    this.formError = null;
    const ids: number[] = this.dataSource.data.filter(el => el.checked).map(el => el.id);
    this.dialog.open(ModaleComponent, {
      data: {
        body: "Procedere all'eliminazione di " + ids.length + (ids.length == 1 ? " elemento?" : " elementi?"),
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
    this.mediaService.bulkDeletePhoto(ids).subscribe((res: any) => {
      this.dialog.open(ModaleComponent, {
        data: {
          body: res.message,
          showPositiveCta: false
        },
        autoFocus: false,
        restoreFocus: false,
        disableClose: true
      }).afterClosed().subscribe(() => {
        this.getPhotos();
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
