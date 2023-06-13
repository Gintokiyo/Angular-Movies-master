import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { PaginationModel } from "../../../../core/models/pagination.model";
import { MoviesService } from "../../services/movies.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { SeoService } from "../../../../core/services/seo.service";
import { take } from "rxjs/operators";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { OnTVService } from "../../services/onTV.service";
import { IMovie } from "../../interfaces/movie.interface";
import { ITV } from "../../interfaces/tv.interface";
import { IContent } from "../../interfaces/content.interface";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { DatabaseService } from "../../services/database.service";
import { ISeries } from "../../interfaces/series.interface";
import { SeriesModel } from "../../models/series.model";
import { MovieModel } from "../../models/movie.model";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
  imports: [
    MatButtonModule,
    NgForOf,
    NgIf,
    DatePipe,
    SharedModule,
    MatProgressBarModule,
    CdkDrag,
    MatDialogModule,
    CdkDragHandle,
  ],
  standalone: true,
})
export class DetailComponent implements OnInit {
  contentType = "";
  content!: Partial<IMovie | ITV | any>;
  recomendedContentList: Array<PaginationModel> = [];
  video: IContent;
  isLoading = true;
  isSeries: boolean;
  newSeries: SeriesModel;

  @ViewChild("matTrailerDialog") matTrailerDialog: TemplateRef<any>;

  constructor(
    private moviesService: MoviesService,
    private tvShowsService: OnTVService,
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    public trailerDialog: MatDialog
  ) {
    this.contentType = this.router.url.split("/")[1];
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params["url"];

      if (this.contentType === "movies") {
        this.getMovie(id);
        this.getMovieVideo(id);
        this.getRecomendedMovie(id);
        this.isSeries = false;
      } else {
        if (this.contentType === "followed-movies") {
          this.getSingleSeries(id);
          this.isSeries = true;
        }
        else {
          this.isSeries = false;
        }
      }
    });
  }

  getMovie(id) {
    this.isLoading = true;

    this.moviesService
      .getMovie(id)
      .pipe(take(1))
      .subscribe((movie) => {
        this.content = movie;
        this.generateSeo();
        this.isLoading = false;
      });
  }

  getMovieVideo(id) {
    this.moviesService
      .getMovieVideos(id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res?.results?.length > 0) {
            const trailerList = res.results.filter(
              (video) => video.type === "Trailer"
            );
            this.video = trailerList[0];
            this.video["url"] = this.sanitizer.bypassSecurityTrustResourceUrl(
              "https://www.youtube.com/embed/" + this.video["key"]
            );
          } else {
            this.video = null;
          }
        },
        () => {}
      );
  }

  getRecomendedMovie(id) {
    this.moviesService
      .getRecomendMovies(id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.recomendedContentList = res.results.slice(0, 12);
        },
        () => {}
      );
  }

  // TV
  getTVShow(id) {
    this.isLoading = true;

    this.tvShowsService
      .getTVShow(id)
      .pipe(take(1))
      .subscribe((tvShow) => {
        this.content = tvShow;
        this.generateSeo();
        this.isLoading = false;
      });
  }

  getTVShowVideo(id) {
    this.tvShowsService
      .getTVShowVideos(id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res?.results?.length > 0) {
            this.video = res.results.filter(
              (video) => video.type === "Trailer"
            )[0];
            this.video["url"] = this.sanitizer.bypassSecurityTrustResourceUrl(
              "https://www.youtube.com/embed/" + this.video["key"]
            );
          } else {
            this.video = null;
          }
        },
        () => {}
      );
  }

  getRecomendedTVShow(id) {
    this.tvShowsService
      .getRecomendTVShows(id)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.recomendedContentList = res.results.slice(0, 12);
        },
        () => {}
      );
  }

  getSingleSeries(id): void {
    this.databaseService
      .getSingleSeries(id)
      .pipe()
      .subscribe((res) => {
        let movie: MovieModel = {
          id: res.seriesId,
          title: res.seriesName,
          original_title: res.seriesOriginalName,
          original_language: res.seriesOriginalLanguage,
          backdrop_path: res.seriesBackgroundUrl,
          poster_path: res.seriesPosterUrl,
          release_date: " ",
          overview: res.seriesDescription,
          homepage: res.seriesHomepage,
          adult: false,
          genres: undefined,
          imdb_id: undefined,
          popularity: undefined,
          vote_average: res.seriesRating,
          production_companies: undefined,
          production_countries: undefined,
          revenue: undefined,
          runtime: undefined,
          spoken_languages: undefined,
          status: "Finished",
          tagline: " ",
          video: false,
          vote_count: 0,
        };
        this.content = movie;
        console.log(this.content);
        this.isLoading = false;
      });
  }

  postNewSeries(): void {
    this.newSeries = new SeriesModel();
    console.log(this.content);
    this.newSeries.seriesId = this.content.id;
    this.newSeries.seriesName = this.content.title;
    this.newSeries.seriesOriginalName = this.content.original_title;
    this.newSeries.seriesDescription = this.content.overview;
    this.newSeries.seriesRating = this.content.vote_average;
    this.newSeries.seriesSeasonCount = 1;
    this.newSeries.seriesEpisodeCount = 1;
    this.newSeries.seriesLatestEpisode = "none";
    this.newSeries.seriesPosterUrl = this.content.poster_path;
    this.newSeries.seriesReleaseDate = new Date(
      this.content.release_date
    ).getTime();
    this.newSeries.seriesUpdateCycle = 0;
    this.newSeries.seriesBackgroundUrl = this.content.backdrop_path;
    this.newSeries.seriesOriginalLanguage = this.content.original_language;
    this.newSeries.seriesHomepage = this.content.homepage;
    console.log(this.newSeries);

    this.databaseService.postSingleSeries(this.newSeries).subscribe((res) => {
      console.log(res);
    });
    console.log("Success");
  }

  // Seo tags
  generateSeo() {
    this.seo.generateTags({
      title: `${this.content.title}`,
      description: `${this.content.overview}`,
      image: `https://image.tmdb.org/t/p/w780/${this.content.backdrop_path}`,
      slug: "movie",
    });
  }

  openDialog(): void {
    const dialogRef = this.trailerDialog.open(this.matTrailerDialog, {});
    dialogRef.disableClose = false;
  }
}
