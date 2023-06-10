import {Component, OnInit} from '@angular/core';
import {PaginationModel} from '../../core/models/pagination.model';
import {MoviesService} from './services/movies.service';
import {take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {OnTVService} from "./services/onTV.service";
import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-movies',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  contentType = '';
  nowPlaying: Array<PaginationModel> = [];

  totalResults: any;

  constructor(
    private moviesService: MoviesService,
    private tvShowsService: OnTVService,
    private databaseService: DatabaseService,
    private router: Router
  ) {
    this.contentType = this.router.url.split('/')[1];
  }

  ngOnInit() {

    if (this.contentType === 'movies') {
      this.getNowPlayinMovies(1);
    } else {
      this.getSeries();
    }

  }

  getNowPlayinMovies(page: number) {
    this.moviesService.getNowPlaying(page).pipe(take(1)).subscribe(
      res => {
        this.totalResults = res.total_results;
        this.nowPlaying = res.results;
      }, () => {}
    );
  }

  getNowPlayinTVShows(page: number) {
    this.tvShowsService.getTvOnTheAir(page).pipe(take(1)).subscribe(
      res => {
        this.totalResults = res.total_results;
        this.nowPlaying = res.results;
      }, () => {}
    );
  }

  getSeries(): void {
    this.databaseService.getAllSeries().pipe().subscribe((res) => {
      this.totalResults = res.results;
      console.log(res);
    })
  }

  changePage(event) {
    if (this.contentType === 'movies') {
      this.getNowPlayinMovies(event.pageIndex + 1);
    } else {
      this.getNowPlayinTVShows(event.pageIndex + 1);
    }
  }

}
