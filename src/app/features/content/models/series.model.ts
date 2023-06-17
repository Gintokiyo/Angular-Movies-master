export class SeriesModel {
    public seriesId: number; //Database ID
    public seriesName: string;
    public seriesOriginalName: string;
    public seriesDescription: string; //overview
    public seriesRating: number; //vote_average
    public seriesSeasonCount: number; //number_of_seasons
    public seriesEpisodeCount: number; //number_of_episodes
    public seriesLatestEpisode: string;
    public seriesPosterUrl: string; //poster_path
    public seriesReleaseDate: number; //first_air_date
    public seriesUpdateCycle: number;
    public seriesBackgroundUrl: string; //backdrop_path
    public seriesOriginalLanguage: string; //original_language
    public seriesHomepage: string; //homepage
    public seriesExternalId: number; //External API Id
  }
  