import { Canvas, Rect } from '@shopify/react-native-skia';
import { Platform, View, StyleSheet } from 'react-native';

interface GymProps {
  width: number;
  height: number;
}

/**
 * Pixel art gym background rendered with Skia.
 * Contains: weights, bench, mirror, speaker.
 */
export default function Gym({ width, height }: GymProps) {
  if (Platform.OS === 'web') {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a20' }]} />;
  }

  const px = Math.max(2, Math.floor(width / 80));
  const groundY = height * 0.85;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Wall */}
      <Rect x={0} y={0} width={width} height={height} color="#1a1a20" />

      {/* Floor (rubber mat look) */}
      <Rect x={0} y={groundY} width={width} height={height - groundY} color="#12151a" />

      {/* Weight rack (left) */}
      <Rect x={width * 0.05} y={groundY - px * 20} width={px * 2} height={px * 20} color="#555555" />
      <Rect x={width * 0.05 + px * 6} y={groundY - px * 20} width={px * 2} height={px * 20} color="#555555" />
      {/* Weights on rack */}
      <Rect x={width * 0.05 + px * 1} y={groundY - px * 18} width={px * 6} height={px * 3} color="#333333" />
      <Rect x={width * 0.05 + px * 1} y={groundY - px * 14} width={px * 6} height={px * 3} color="#444444" />
      <Rect x={width * 0.05 + px * 1} y={groundY - px * 10} width={px * 6} height={px * 3} color="#333333" />

      {/* Bench */}
      <Rect x={width * 0.35} y={groundY - px * 6} width={px * 16} height={px * 3} color="#555555" />
      <Rect x={width * 0.37} y={groundY - px * 3} width={px * 3} height={px * 3} color="#444444" />
      <Rect x={width * 0.35 + px * 12} y={groundY - px * 3} width={px * 3} height={px * 3} color="#444444" />

      {/* Barbell on floor */}
      <Rect x={width * 0.3} y={groundY - px * 3} width={px * 3} height={px * 3} color="#333333" />
      <Rect x={width * 0.3 + px * 3} y={groundY - px * 2} width={px * 10} height={px * 1} color="#666666" />
      <Rect x={width * 0.3 + px * 13} y={groundY - px * 3} width={px * 3} height={px * 3} color="#333333" />

      {/* Mirror on wall */}
      <Rect x={width * 0.6} y={height * 0.1} width={width * 0.25} height={height * 0.45} color="#2a3a4a" />
      <Rect x={width * 0.61} y={height * 0.11} width={width * 0.23} height={height * 0.43} color="#3a4a5a" />

      {/* Speaker (top right) */}
      <Rect x={width * 0.88} y={height * 0.15} width={px * 6} height={px * 8} color="#222222" />
      <Rect x={width * 0.88 + px * 1} y={height * 0.15 + px * 2} width={px * 4} height={px * 4} color="#333333" />
    </Canvas>
  );
}
