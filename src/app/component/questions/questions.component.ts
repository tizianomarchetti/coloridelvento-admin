import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Question } from 'src/app/interface/question';
import { QuizMapperService } from 'src/app/services/quiz-mapper.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  questions: Question[] = [];

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  columnLabels: any[] = [];

  formError: string = null;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private router: Router, private route: ActivatedRoute, private quizService: QuizService, 
    private quizMapper: QuizMapperService) { }

  ngOnInit() {
    this.displayedColumns = ['id', 'title'];
    this.columnLabels = [
      {
        id: 'id',
        label: '#'
      },
      {
        id: 'title',
        label: 'Titolo'
      }
    ];

    this.dataSource = new MatTableDataSource();

    this.getQuestions();
  }

  getQuestions() {
    this.questions = [];
    this.quizService.getQuestions().subscribe((res: any) => {
      this.questions = res.map(el => this.quizMapper.mapQuestion(el));

      this.populateDataSource();
      this.setPaginator();
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
    this.questions.forEach(question => {
      this.dataSource.data.push({
        id: question.id,
        title: question.title_it,
      });
    });
  }

  getColumnLabel(colId: string) {
    return this.columnLabels.find(el => el.id == colId).label
  }

  navigateTo(row) {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

}
