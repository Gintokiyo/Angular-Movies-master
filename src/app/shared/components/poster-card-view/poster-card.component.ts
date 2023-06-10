import { Component, Input } from '@angular/core';
import { SeriesModel } from 'app/features/content/models/series.model';

@Component({
  selector: 'app-poster-card',
  templateUrl: './poster-card.component.html',
  styleUrls: ['./poster-card.component.scss']
})
export class MovieCardComponent {

  @Input() model: any;
  @Input() isMovie: boolean;
  @Input() seriesModel: SeriesModel;
  @Input() exists: boolean;

  constructor () {}
}
