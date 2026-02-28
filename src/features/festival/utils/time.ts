import { format, parseISO } from 'date-fns';

export function formatTime(iso: string) {
  // Example: "6:30 PM"
  return format(parseISO(iso), 'h:mm a');
}

export function formatRange(start: string, end: string) {
  return `${formatTime(start)} – ${formatTime(end)}`;
}
