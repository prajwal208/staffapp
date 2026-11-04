import { useId } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { BrandGradient } from '@/constants/theme';

type GradientFillProps = {
  colors?: readonly string[];
  /** Gradient direction as start/end points in the 0–1 range. */
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
};

/** Fills its parent; give the parent `overflow: 'hidden'` and a border radius to clip it. */
export function GradientFill({
  colors = BrandGradient,
  from = { x: 0, y: 0.4 },
  to = { x: 1, y: 0.6 },
  style,
}: GradientFillProps) {
  const id = useId().replace(/:/g, '');
  return (
    <Svg style={[StyleSheet.absoluteFill, style]} pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1={from.x} y1={from.y} x2={to.x} y2={to.y}>
          {colors.map((color, index) => (
            <Stop key={color + index} offset={index / (colors.length - 1)} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

type GradientTextProps = {
  children: string;
  fontSize: number;
  fontWeight?: '700' | '800' | '900';
  /** Rendered box size; the text is baseline-aligned inside it. */
  width: number;
  height?: number;
  letterSpacing?: number;
};

export function GradientText({
  children,
  fontSize,
  fontWeight = '900',
  width,
  height = Math.round(fontSize * 1.25),
  letterSpacing = 0,
}: GradientTextProps) {
  const id = useId().replace(/:/g, '');
  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          {BrandGradient.map((color, index) => (
            <Stop key={color} offset={index / (BrandGradient.length - 1)} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText
        fill={`url(#${id})`}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
        x={0}
        y={fontSize * 0.95}>
        {children}
      </SvgText>
    </Svg>
  );
}
