import {Component, OnInit} from '@angular/core';
import {PaginationModel} from '../../core/models/pagination.model';
import {MoviesService} from './services/movies.service';
import {take} from 'rxjs/operators';
import {Router} from "@angular/router";
import {OnTVService} from "./services/onTV.service";
import { DatabaseService } from './services/database.service';
import { MovieModel } from './models/movie.model';
import { Pagination } from 'swiper';
import { SeriesModel } from './models/series.model';

@Component({
  selector: 'app-movies',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  contentType = '';
  nowPlaying: Array<PaginationModel> = [];
  paginationObject: PaginationModel;
  paginationObjectList: Array<PaginationModel> = [];
  totalResults: any;
  isSeries: boolean;
  isSearch: boolean;
  searchExists: boolean;
  searchKeyword: string;

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
      this.isSeries = false;
      this.isSearch = true;
    } else {
      this.getSeries(1);
      this.isSeries = true;
      this.isSearch = false;
    }

  }

  getMovies(name: string, page: number | undefined): void {
    console.log(name)
    this.searchKeyword = name;
    this.searchExists = name === '' ? false : true;
    page = page === undefined ? 1 : page;

    if(this.searchExists) {
      this.moviesService.searchMovies(name, page).pipe(take(1)).subscribe(
        res => {
          this.totalResults = res.total_results;
          this.nowPlaying = res.results;
        }, () => {}
      );
    }
    else {
      this.getNowPlayinMovies(1);
    }
    
    console.log(this.searchExists);
  }

  getNowPlayinMovies(page: number) {
    this.moviesService.getNowPlaying(page).pipe(take(1)).subscribe(
      res => {
        this.totalResults = res.total_results;
        this.nowPlaying = res.results;
        console.log(this.nowPlaying);
        console.log(res);
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

  getSeries(page: number): void {
    this.databaseService.getAllSeries().pipe().subscribe((res) => {
      this.totalResults = res.length;
    })
    this.databaseService.getPageSeries(page).pipe().subscribe((res) => {
      let movieList = new Array<MovieModel>();
      res.forEach(element => {
        let movie: MovieModel = {
          id: element.seriesId,
          title: element.seriesName,
          original_title: element.seriesOriginalName,
          original_language: element.seriesOriginalLanguage,
          backdrop_path: element.seriesBackgroundUrl,
          poster_path: element.seriesPosterUrl,
          release_date: '',
          overview: element.seriesDescription,
          homepage: element.seriesHomepage,
          adult: false,
          genres: undefined,
          imdb_id: undefined,
          popularity: undefined,
          vote_average: element.seriesRating,
          production_companies: undefined,
          production_countries: undefined,
          revenue: undefined,
          runtime: undefined,
          spoken_languages: undefined,
          status: 'Finished',
          tagline: ' ',
          video: false,
          vote_count: 0
        }
        movieList.push(movie);
        
      });
      this.paginationObject = new PaginationModel();
      this.paginationObject.dates = undefined;
      this.paginationObject.page = 1;
      this.paginationObject.total_results = movieList.length;
      this.paginationObject.total_pages = Math.ceil(this.paginationObject.total_results / 20);
      this.paginationObject.results = movieList;
      this.paginationObjectList.push(this.paginationObject);
      this.nowPlaying = this.paginationObjectList;
      this.paginationObjectList = new Array<PaginationModel>();
      console.log(res);
      console.log(this.paginationObjectList[0]);
      console.log(this.nowPlaying);
    });
  }

  changePage(event) {
    if (this.contentType === 'movies') {
      if(this.searchExists) {
        this.getMovies(this.searchKeyword, event.pageIndex + 1);
      }
      else {
        this.getNowPlayinMovies(event.pageIndex + 1);
      }
    } else {
      this.getSeries(event.pageIndex + 1);
    }
  }

}
