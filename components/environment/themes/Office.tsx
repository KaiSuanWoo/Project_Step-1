import { Canvas, Rect } from '@shopify/react-native-skia';
import { Platform, View, StyleSheet } from 'react-native';

interface OfficeProps {
  width: number;
  height: number;
}

/**
 * Pixel art office background rendered with Skia.
 * Contains: monitor, keyboard, plant, whiteboard.
 */
export default function Office({ width, height }: OfficeProps) {
  if (Platform.OS === 'web') {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a1a' }]} />;
  }

  const px = Math.max(2, Math.floor(width / 80));
  const groundY = height * 0.85;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Wall */}
      <Rect x={0} y={0} width={width} height={height} color="#1a1a1a" />

      {/* Floor */}
      <Rect x={0} y={groundY} width={width} height={height - groundY} color="#151520" />

      {/* Desk */}
      <Rect x={width * 0.15} y={groundY - px * 8} width={width * 0.5} height={px * 3} color="#3a3a4a" />
      <Rect x={width * 0.18} y={groundY - px * 5} width={px * 3} height={px * 5} color="#2a2a3a" />
      <Rect x={width * 0.58} y={groundY - px * 5} width={px * 3} height={px * 5} color="#2a2a3a" />

      {/* Monitor */}
      <Rect x={width * 0.28} y={groundY - px * 22} width={px * 16} height={px * 12} color="#2a2a2a" />
      <Rect x={width * 0.29} y={groundY - px * 21} width={px * 14} height={px * 10} color="#118AB2" />
      {/* Monitor stand */}
      <Rect x={width * 0.34} y={groundY - px * 10} width={px * 4} height={px * 2} color="#3a3a3a" />

      {/* Keyboard */}
      <Rect x={width * 0.3} y={groundY - px * 9} width={px * 10} height={px * 1} color="#4a4a5a" />

      {/* Plant (right side) */}
      <Rect x={width * 0.75} y={groundY - px * 6} width={px * 4} height={px * 6} color="#5c3a1e" />
      <Rect x={width * 0.74} y={groundY - px * 10} width={px * 6} height={px * 4} color="#2a8a4a" />
      <Rect x={width * 0.75} y={groundY - px * 13} width={px * 4} height={px * 3} color="#3aaa5a" />

      {/* Whiteboard on wall */}
      <Rect x={width * 0.6} y={height * 0.15} width={width * 0.28} height={height * 0.25} color="#e8e8e0" />
      <Rect x={width * 0.62} y={height * 0.2} width={width * 0.12} height={px * 1} color="#3a6ea5" />
      <Rect x={width * 0.62} y={height * 0.25} width={width * 0.18} height={px * 1} color="#c44020" />
      <Rect x={width * 0.62} y={height * 0.3} width={width * 0.08} height={px * 1} color="#2a8a4a" />
    </Canvas>
  );
}
