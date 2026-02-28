export type FestivalDay = { id: string; label: string };
export type FestivalStage = { id: string; label: string };

export type FestivalSet = {
  id: string;
  dayId: string;
  stageId: string;
  bandName: string;
  genres: string[];
  start: string; // ISO-ish local datetime string
  end: string; // ISO-ish local datetime string
  imageUrl?: string;
  spotifyArtistId?: string;
};

export type Festival = {
  id: string;
  name: string;
  days: FestivalDay[];
  stages: FestivalStage[];
  sets: FestivalSet[];
};

export type FestivalDoc = {
  festival: Festival;
};
