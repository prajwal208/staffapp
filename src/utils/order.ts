const STATUS_COLOR_MAP: Record<string, string> = {
  blue: '#2196F3',
  orange: '#FF9800',
  green: '#4CAF50',
  red: '#E53935',
  purple: '#9C27B0',
  yellow: '#FBC02D',
  gray: '#757575',
  grey: '#757575',
};

export function getStatusColor(color: string) {
  if (color.startsWith('#')) return color;
  return STATUS_COLOR_MAP[color.toLowerCase()] ?? '#1B3A6B';
}

export function formatDeliveryDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
