export interface ISeries {
    seriesId: number; //Database ID
    seriesName: string;
    seriesOriginalName: string;
    seriesDescription: string; //overview
    seriesRating: number; //vote_average
    seriesSeasonCount: number; //number_of_seasons
    seriesEpisodeCount: number; //number_of_episodes
    seriesLatestEpisode: string;
    seriesPosterUrl: string; //poster_path
    seriesReleaseDate: number; //first_air_date
    seriesUpdateCycle: number;
    seriesBackgroundUrl: string; //backdrop_path
    seriesOriginalLanguage: string; //original_language
    seriesHomepage: string; //homepage
  }