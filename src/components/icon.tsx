import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'arrow-left'
  | 'arrow-right'
  | 'info'
  | 'calendar'
  | 'ruler'
  | 'share'
  | 'backspace'
  | 'logout'
  | 'store';

type Props = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, color, strokeWidth = 2 }: Props) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round">
      {renderShape(name)}
    </Svg>
  );
}

function renderShape(name: IconName) {
  switch (name) {
    case 'arrow-left':
      return <Path d="M19 12H5M11 6l-6 6 6 6" />;
    case 'arrow-right':
      return <Path d="M5 12h14M13 6l6 6-6 6" />;
    case 'info':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 8v5M12 16v.01" />
        </>
      );
    case 'calendar':
      return (
        <>
          <Rect x="3" y="4" width="18" height="18" rx="2" />
          <Line x1="16" y1="2" x2="16" y2="6" />
          <Line x1="8" y1="2" x2="8" y2="6" />
          <Line x1="3" y1="10" x2="21" y2="10" />
        </>
      );
    case 'ruler':
      return (
        <>
          <Rect x="2" y="7" width="20" height="10" rx="2" />
          <Line x1="6" y1="7" x2="6" y2="11" />
          <Line x1="10" y1="7" x2="10" y2="12" />
          <Line x1="14" y1="7" x2="14" y2="11" />
          <Line x1="18" y1="7" x2="18" y2="12" />
        </>
      );
    case 'share':
      return (
        <>
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <Polyline points="16 6 12 2 8 6" />
          <Line x1="12" y1="2" x2="12" y2="15" />
        </>
      );
    case 'backspace':
      return <Path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1zM17 9l-5 6M12 9l5 6" />;
    case 'logout':
      return <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;
    case 'store':
      return <Path d="M3 9l1.5-5h15L21 9M4 9v11h16V9M3 9h18" />;
  }
}
