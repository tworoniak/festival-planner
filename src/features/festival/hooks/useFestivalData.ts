import { FestivalDocSchema } from '../data/lineup.schema';
import { getFestivalDoc } from '../data/festivals';

export function useFestivalData(festivalId: string) {
  const doc = getFestivalDoc(festivalId);
  if (!doc) throw new Error(`Festival not found: ${festivalId}`);

  const parsed = FestivalDocSchema.parse(doc);
  return { festival: parsed.festival };
}
