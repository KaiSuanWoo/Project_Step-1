import { Canvas, Rect, RoundedRect } from '@shopify/react-native-skia';
import { Platform, View, StyleSheet } from 'react-native';

interface StudyRoomProps {
  width: number;
  height: number;
}

/**
 * Pixel art study room background rendered with Skia.
 * Contains: desk, books, lamp, fairy lights along top.
 */
export default function StudyRoom({ width, height }: StudyRoomProps) {
  if (Platform.OS === 'web') {
    return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1a1a2e' }]} />;
  }

  const px = Math.max(2, Math.floor(width / 80));
  const groundY = height * 0.85;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Wall */}
      <Rect x={0} y={0} width={width} height={height} color="#1a1a2e" />

      {/* Floor */}
      <Rect x={0} y={groundY} width={width} height={height - groundY} color="#12121e" />

      {/* Desk */}
      <Rect x={width * 0.1} y={groundY - px * 8} width={width * 0.35} height={px * 3} color="#5c3a1e" />
      <Rect x={width * 0.12} y={groundY - px * 5} width={px * 3} height={px * 5} color="#4a2e16" />
      <Rect x={width * 0.38} y={groundY - px * 5} width={px * 3} height={px * 5} color="#4a2e16" />

      {/* Books on desk */}
      <Rect x={width * 0.14} y={groundY - px * 12} width={px * 4} height={px * 4} color="#3a6ea5" />
      <Rect x={width * 0.14 + px * 4} y={groundY - px * 11} width={px * 3} height={px * 3} color="#c44020" />
      <Rect x={width * 0.14 + px * 7} y={groundY - px * 12} width={px * 3} height={px * 4} color="#2a8a4a" />

      {/* Lamp */}
      <Rect x={width * 0.36} y={groundY - px * 18} width={px * 2} height={px * 10} color="#888888" />
      <Rect x={width * 0.34} y={groundY - px * 20} width={px * 6} height={px * 3} color="#e8d080" />
      {/* Lamp glow */}
      <Rect x={width * 0.32} y={groundY - px * 17} width={px * 10} height={px * 1} color="rgba(232,208,128,0.15)" />

      {/* Bookshelf on wall (right side) */}
      <Rect x={width * 0.6} y={height * 0.2} width={width * 0.3} height={px * 3} color="#5c3a1e" />
      <Rect x={width * 0.62} y={height * 0.2 - px * 4} width={px * 5} height={px * 4} color="#c44020" />
      <Rect x={width * 0.62 + px * 5} y={height * 0.2 - px * 3} width={px * 4} height={px * 3} color="#3a6ea5" />
      <Rect x={width * 0.62 + px * 9} y={height * 0.2 - px * 5} width={px * 3} height={px * 5} color="#6a5a8a" />

      {/* Fairy lights along top */}
      {Array.from({ length: 8 }, (_, i) => {
        const lx = width * 0.1 + i * (width * 0.1);
        const colors = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2'];
        return (
          <Rect
            key={i}
            x={lx}
            y={px * 4}
            width={px * 2}
            height={px * 2}
            color={colors[i % colors.length]}
          />
        );
      })}
    </Canvas>
  );
}
