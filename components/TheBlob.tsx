import { BlurMask, Canvas, Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import React, { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import { Easing, interpolateColor, SharedValue, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface TheBlobProps {
    intensity: SharedValue<number>; // 0 to 1
    location: SharedValue<number>; // 0 (Mind) to 1 (Body)
}

export const TheBlob = ({ intensity, location }: TheBlobProps) => {
    const { width } = useWindowDimensions();
    const centerX = width / 2;
    const centerY = 200; // Fixed height in the container

    // Animation driver
    const time = useSharedValue(0);

    useEffect(() => {
        time.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    }, []);

    const color = useDerivedValue(() => {
        return interpolateColor(
            intensity.value,
            [0, 0.33, 0.66, 1],
            ['#4A90E2', '#9C27B0', '#FF9800', '#FF4C4C'] // Blue, Purple, Orange, Red
        );
    });

    const radius = useDerivedValue(() => {
        // Base radius + pulse effect
        const base = 100 + (intensity.value * 20); // Grow with intensity

        // Use time value directly or simple math since we defined time 0->1 linear/eased
        // But let's use interpolate for clarity if needed, or just math
        // time varies 0->1.
        const pulseEffect = 10 + (intensity.value * 20);
        return base + (time.value * pulseEffect);
    });

    const blur = useDerivedValue(() => {
        // Location: 0 (Mind/Static) -> Less Blur/Sharper? Or 1 (Body/Liquid) -> More Blur?
        // Let's make Body (1) more "gooey" (High blur). Mind (0) more "electric" (Low blur).
        return 10 + (location.value * 20);
    });

    const gradientColors = useDerivedValue(() => {
        return [color.value, '#000000'];
    });

    return (
        <Canvas style={{ width: width, height: 400 }}>
            <Group>
                <Circle cx={centerX} cy={centerY} r={radius} color={color}>
                    <RadialGradient
                        c={vec(centerX, centerY)}
                        r={150}
                        colors={gradientColors}
                    />
                    <BlurMask blur={blur} style="normal" />
                </Circle>
            </Group>
        </Canvas>
    );
};
