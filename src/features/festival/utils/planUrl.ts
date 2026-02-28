export function parsePlanParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function buildPlanParam(ids: string[]) {
  // stable output helps avoid noisy URL changes
  return [...new Set(ids)].sort().join(',');
}
