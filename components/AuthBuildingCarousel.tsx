import { useState } from "react";
import {
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { colors, radius } from "../constants/theme";

const slides = [
    require("../assets/images/auth-building-1.jpg"),
    require("../assets/images/auth-building-2.jpg"),
    require("../assets/images/auth-building-3.jpg"),
];

type AuthBuildingCarouselProps = {
    height?: number;
};

export default function AuthBuildingCarousel({ height = 320 }: AuthBuildingCarouselProps) {
    const { width } = useWindowDimensions();
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(Math.max(0, Math.min(nextIndex, slides.length - 1)));
    };

    return (
        <View style={[styles.container, { height }]}>
            <FlatList
                data={slides}
                horizontal
                pagingEnabled
                bounces={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => `auth-building-${index}`}
                onMomentumScrollEnd={handleScrollEnd}
                renderItem={({ item, index }) => (
                    <Image
                        source={item}
                        style={{ width, height }}
                        resizeMode="cover"
                        accessibilityRole="image"
                        accessibilityLabel={`Modern building ${index + 1} of ${slides.length}`}
                    />
                )}
            />

            <View pointerEvents="none" style={styles.pagination}>
                {slides.map((_, index) => (
                    <View
                        key={`auth-building-dot-${index}`}
                        style={[
                            styles.dot,
                            index === activeIndex ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
    },
    pagination: {
        position: "absolute",
        bottom: 16,
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: radius.pill,
        backgroundColor: colors.overlayMedium,
    },
    dot: {
        height: 6,
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
    },
    activeDot: {
        width: 18,
    },
    inactiveDot: {
        width: 6,
        opacity: 0.62,
    },
});
