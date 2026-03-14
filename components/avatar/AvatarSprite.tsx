import { Canvas, Rect } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue, withRepeat, withTiming, withSequence,
  Easing, useAnimatedStyle,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SPRITES, PALETTE, SpriteAvatarState, SpriteChar } from './sprites';
import { AvatarState } from '@/types';

interface AvatarSpriteProps {
  state?: AvatarState;
  /** Size of one pixel in dp (default 5) */
  pixelSize?: number;
}

const GRID_W = 12;
const GRID_H = 20;

/**
 * Pixel art avatar rendered with React Native Skia.
 * The canvas is wrapped in an Animated.View for idle animations.
 *
 * Active      -> gentle upward bob (600ms)
 * Idle        -> very slow sway (2000ms)
 * Sleeping    -> slow breathe (1800ms)
 * Slacking    -> no animation (still)
 * Celebrating -> fast bounce (400ms)
 * Degraded    -> slight tremble (1200ms)
 * Peak Form   -> subtle pulse glow (1000ms)
 */
export default function AvatarSprite({ state = 'active', pixelSize = 5 }: AvatarSpriteProps) {
  const canvasWidth  = GRID_W * pixelSize;
  const canvasHeight = GRID_H * pixelSize;

  const bob = useSharedValue(0);

  useEffect(() => {
    switch (state) {
      case 'active':
        bob.value = withRepeat(
          withTiming(-pixelSize, { duration: 600, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        break;
      case 'idle':
        bob.value = withRepeat(
          withTiming(Math.round(pixelSize * 0.3), { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        break;
      case 'sleeping':
        bob.value = withRepeat(
          withTiming(Math.round(pixelSize * 0.5), { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          -1,
          true,
        );
        break;
      case 'celebrating':
        bob.value = withRepeat(
          withSequence(
            withTiming(-pixelSize * 2, { duration: 200, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 200, easing: Easing.bounce }),
          ),
          -1,
          false,
        );
        break;
      case 'degraded':
        bob.value = withRepeat(
          withSequence(
            withTiming(-1, { duration: 100 }),
            withTiming(1, { duration: 100 }),
            withTiming(0, { duration: 1000 }),
          ),
          -1,
          false,
        );
        break;
      case 'peak_form':
        bob.value = withRepeat(
          withSequence(
            withTiming(-Math.round(pixelSize * 0.5), { duration: 500, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        break;
      default: // slacking
        bob.value = withTiming(0, { duration: 300 });
        break;
    }
  }, [state, pixelSize]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  // Map AvatarState to sprite key (they match now)
  const spriteKey: SpriteAvatarState = state in SPRITES ? (state as SpriteAvatarState) : 'active';
  const sprite = SPRITES[spriteKey];

  // Build pixel descriptors from the sprite grid
  const pixels: { x: number; y: number; color: string }[] = [];
  for (let row = 0; row < sprite.length; row++) {
    const line = sprite[row];
    for (let col = 0; col < line.length && col < GRID_W; col++) {
      const ch = line[col] as SpriteChar;
      const color = PALETTE[ch];
      if (color === null) continue;
      pixels.push({ x: col * pixelSize, y: row * pixelSize, color });
    }
  }

  // Skia (CanvasKit) is not available on web — render a plain placeholder
  if (Platform.OS === 'web') {
    return <View style={{ width: canvasWidth, height: canvasHeight }} />;
  }

  return (
    <Animated.View style={[{ width: canvasWidth, height: canvasHeight }, animStyle]}>
      <Canvas style={{ flex: 1 }}>
        {pixels.map(({ x, y, color }) => (
          <Rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={pixelSize}
            height={pixelSize}
            color={color}
          />
        ))}
      </Canvas>
    </Animated.View>
  );
}
