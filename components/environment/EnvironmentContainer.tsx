import { useState } from 'react';
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import AvatarSprite from '@/components/avatar/AvatarSprite';
import { AvatarState } from '@/types';
import { colors, radius } from '@/constants/Theme';
import StudyRoom from './themes/StudyRoom';
import Office from './themes/Office';
import Gym from './themes/Gym';

type NicheTheme = 'education' | 'work' | 'fitness' | 'custom';

interface EnvironmentContainerProps {
  avatarState: AvatarState;
  niche?: NicheTheme;
  pixelSize?: number;
  /** If true, fills parent completely with no border/padding */
  fullScreen?: boolean;
}

/**
 * Renders a pixel-art environment with the avatar centered.
 * Uses Terraria/pixel styling rules INSIDE (bevel border, low radius).
 *
 * `fullScreen` mode: fills entire parent, no bevel border — used on Realm tab.
 * Default mode: 16:10 aspect with bevel border — used when embedded.
 */
export default function EnvironmentContainer({
  avatarState,
  niche = 'education',
  pixelSize = 5,
  fullScreen = false,
}: EnvironmentContainerProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setLayout({ width, height });
  };

  const renderTheme = () => {
    if (layout.width === 0) return null;
    switch (niche) {
      case 'work':
        return <Office width={layout.width} height={layout.height} />;
      case 'fitness':
        return <Gym width={layout.width} height={layout.height} />;
      case 'education':
      case 'custom':
      default:
        return <StudyRoom width={layout.width} height={layout.height} />;
    }
  };

  return (
    <View style={fullScreen ? styles.fullScreenContainer : styles.outer}>
      <View
        style={fullScreen ? styles.fullScreenInner : styles.container}
        onLayout={onLayout}
      >
        {/* Themed background */}
        {renderTheme()}

        {/* Ground line */}
        <View style={styles.ground} />

        {/* Avatar centered */}
        <View style={styles.avatarWrapper}>
          <AvatarSprite state={avatarState} pixelSize={pixelSize} />
        </View>

        {/* State indicator badge */}
        <View style={styles.stateBadge}>
          <View style={[styles.stateDot, stateColorStyle(avatarState)]} />
        </View>
      </View>
    </View>
  );
}

function stateColorStyle(state: AvatarState): ViewStyle {
  switch (state) {
    case 'active':      return { backgroundColor: '#06D6A0' };
    case 'idle':        return { backgroundColor: '#8888A0' };
    case 'celebrating': return { backgroundColor: '#FFD166' };
    case 'peak_form':   return { backgroundColor: '#FFD166' };
    case 'sleeping':    return { backgroundColor: '#118AB2' };
    case 'slacking':    return { backgroundColor: '#EF476F' };
    case 'degraded':    return { backgroundColor: '#EF476F' };
    default:            return { backgroundColor: '#8888A0' };
  }
}

const styles = StyleSheet.create({
  // === Default (embedded) mode ===
  outer: {
    paddingHorizontal: 16,
  },
  container: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radius.small,
    borderWidth: 3,
    borderTopColor: colors.borderLight,
    borderLeftColor: colors.borderLight,
    borderBottomColor: colors.borderDark,
    borderRightColor: colors.borderDark,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  // === Full-screen mode ===
  fullScreenContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenInner: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // === Shared ===
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '15%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: '18%',
  },
  stateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
