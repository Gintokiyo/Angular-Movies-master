import {TvModel} from '../../features/content/models/tv.model';
import {MovieModel} from '../../features/content/models/movie.model';
import { SeriesModel } from 'app/features/content/models/series.model';

export class PaginationModel {

  public dates?: Object;
  public page: number;
  public results: Array<MovieModel | TvModel | SeriesModel>;
  public total_pages: number;
  public total_results: number;

}
