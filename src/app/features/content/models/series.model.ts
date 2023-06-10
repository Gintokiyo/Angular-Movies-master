export class SeriesModel {
  /*
    public id: number; 
    public name: string;
    public original_name: string;
    public overview: string; 
    public vote_average: number; 
    public number_of_seasons: number; 
    public number_of_episodes: number;
    public latest_episode: string;
    public poster_path: string; 
    public first_air_date: Date; 
    public update_cycle: number;
    public backdrop_path: string;
    public original_language: string;
    public homepage: string;
    */
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
  }
  