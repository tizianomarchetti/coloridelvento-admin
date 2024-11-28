import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/interface/result';
import { DictionaryService } from 'src/app/services/dictionary.service';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  results: Result[] = [];
  dictionary: any = null;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  formError: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService, private dictService: DictionaryService) { }

  ngOnInit() {
    this.displayedColumns = ['most_answers', 'title'];
    this.columnLabels = [
      {
        id: 'most_answers',
        label: 'Maggioranza risposte'
      },
      {
        id: 'title',
        label: 'Titolo'
      }
    ];

    this.dataSource = new MatTableDataSource();

    this.getResults();
  }

  print(element, col) {
    console.log(element, col)
  }

  getResults() {
    this.results = [];
    this.quizService.getResults().subscribe((res: any) => {
      this.results = res.map(el => this.quizMapper.mapResult(el));

      this.populateDataSource();
    })
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

  populateDataSource() {
    this.dataSource.data = [];
    this.results.forEach(result => {
      this.dataSource.data.push({
        ...result,
      });
    });

    this.dictService.getDictionary('it').subscribe((res: any) => {
      this.dictionary = JSON.parse(res.result);

      this.dataSource.data.forEach(el => {
        el.title = this.dictionary.section.test.results[el.most_answers].title;
        el.most_answers = el.most_answers.toUpperCase();
      });

      this.setPaginator();
    });
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  navigateTo(row) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

}
