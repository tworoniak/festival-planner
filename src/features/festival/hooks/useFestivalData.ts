import doc from '../data/lineup.sample.json';
import { FestivalDocSchema } from '../data/lineup.schema';
import type { Festival } from '../types/festival';

export function useFestivalData(): { festival: Festival } {
  const parsed = FestivalDocSchema.parse(doc);
  return { festival: parsed.festival };
}
