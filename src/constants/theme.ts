export const Colors = {
  ink: '#1F1537',
  inkSoft: '#5B4F78',
  muted: '#8A819F',
  faint: '#B3AAC4',
  placeholder: '#CFC7DA',
  line: '#EFE9F4',
  bg: '#FFF9F6',
  card: '#FFFFFF',
  field: '#FBF8FD',
  disabled: '#D9D2E3',
  orange: '#FF752A',
  pink: '#FF308C',
  purple: '#C423CF',
  orangeTint: '#FFF1E6',
  pinkBorder: '#F4B6D6',
  success: '#12B76A',
  error: '#E5484D',
  white: '#FFFFFF',
} as const;

export const BrandGradient = [Colors.orange, Colors.pink, Colors.purple] as const;
export const SoftGradient = ['#FFF1E6', '#FFE8F2', '#F6E8FF'] as const;

export const Shadow = {
  card: {
    shadowColor: '#7838A0',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  soft: {
    shadowColor: '#7838A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  glow: {
    shadowColor: Colors.pink,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;
