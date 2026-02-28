import { z } from 'zod';

export const FestivalSetSchema = z.object({
  id: z.string().min(1),
  dayId: z.string().min(1),
  stageId: z.string().min(1),
  bandName: z.string().min(1),
  genres: z.array(z.string().min(1)).default([]),
  start: z.string().min(1),
  end: z.string().min(1),
  imageUrl: z.string().url().optional(),
  spotifyArtistId: z.string().optional(),
});

export const FestivalSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  days: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
  stages: z.array(z.object({ id: z.string(), label: z.string() })).min(1),
  sets: z.array(FestivalSetSchema).default([]),
});

export const FestivalDocSchema = z.object({
  festival: FestivalSchema,
});

export type FestivalDocParsed = z.infer<typeof FestivalDocSchema>;
