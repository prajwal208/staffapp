import { StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type Blob = { color: string; opacity: number; cx: number; cy: number; r: number };

const DEFAULT_BLOBS: Blob[] = [
  { color: '#FFB366', opacity: 0.55, cx: 50, cy: 30, r: 170 },
  { color: '#FF5FA8', opacity: 0.4, cx: 330, cy: 50, r: 160 },
  { color: '#8E6BFF', opacity: 0.35, cx: 180, cy: 190, r: 150 },
];

type Props = {
  blobs?: Blob[];
  /** Multiplies every blob's opacity. */
  intensity?: number;
};

/** Soft blurred colour blobs; react-native has no CSS blur, so radial gradients fake it. */
export function Blobs({ blobs = DEFAULT_BLOBS, intensity = 1 }: Props) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        {blobs.map((blob, index) => (
          <RadialGradient key={index} id={`blob${index}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={blob.color} stopOpacity={blob.opacity * intensity} />
            <Stop offset="1" stopColor={blob.color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {blobs.map((blob, index) => (
        <Circle key={index} cx={blob.cx} cy={blob.cy} r={blob.r} fill={`url(#blob${index})`} />
      ))}
    </Svg>
  );
}
