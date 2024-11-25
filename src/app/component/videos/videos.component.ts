import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatCheckboxChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Video } from 'src/app/interface/video';
import { VideoMapperService } from 'src/app/services/video-mapper.service';
import { VideoService } from 'src/app/services/video.service';
import { ModaleComponent } from '../modale/modale.component';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  videos: Video[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  checkableLength: number;

  formError: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private videoService: VideoService, 
    private videoMapper: VideoMapperService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.displayedColumns = ['checked', 'title', 'cover'];
    this.columnLabels = [
      {
        id: 'title',
        label: 'Titolo'
      },
      {
        id: 'cover',
        label: 'Flag cover'
      }
    ];

    this.dataSource = new MatTableDataSource();

    this.getVideos();
  }

  getVideos() {
    this.videos = [];
    this.videoService.getVideos().subscribe((res: any) => {
      this.videos = res.map(el => this.videoMapper.mapVideo(el));

      this.populateDataSource();
      this.setFilterPredicate();
      this.setSort();
      this.setPaginator();
    })
  }

  populateDataSource() {
    this.dataSource.data = [];
    this.videos.forEach(video => {
      this.dataSource.data.push({...video});
    });
  }

  setFilterPredicate() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return Object.keys(data).some(k => {
        return k == 'title' && this.displayedColumns.includes(k) && data[k].toLowerCase().includes(filter.toLowerCase())
      });
    }

    this.updateCheckableLength();
  }

  setSort() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    this.updateCheckableLength();
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  navigateTo(row) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

  updateCheckableLength() {
    this.checkableLength = (this.dataSource.filteredData || this.dataSource.data).length;

    this.displayedColumns = this.checkableLength == 0 
      ? this.displayedColumns.filter(el => el != 'checked')
      : (this.displayedColumns.includes('checked') ? this.displayedColumns : ['checked', ...this.displayedColumns]);
  }

  getCheckedLength() {
    const length = this.dataSource 
      ? (this.dataSource.filteredData || this.dataSource.data).filter(el => el.checked).length 
      : 0;
    return length;
  }

  selectAll(event: MatCheckboxChange) {
    (this.dataSource.filteredData || this.dataSource.data).forEach(el => {
      el.checked = event.checked;
    });
  }

  delete() {
    const ids: number[] = (this.dataSource.filteredData || this.dataSource.data).filter(el => el.checked).map(el => el.id);
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
        this.getVideos();
        (document.getElementById('filterInput') as HTMLInputElement).value = '';
      })
    }, error => {
      console.error(error)
      this.formError = error.error.message || error.message;
      this.cdr.detectChanges();
      window.scrollTo(0, 0);
    })
  }

}
