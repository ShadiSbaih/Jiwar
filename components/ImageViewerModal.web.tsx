import React from 'react';
import { Modal, View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageViewerModalProps {
    images: { uri: string }[];
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function ImageViewerModal({
    images,
    imageIndex,
    visible,
    onRequestClose,
}: ImageViewerModalProps) {
    const [currentIndex, setCurrentIndex] = React.useState(imageIndex);

    React.useEffect(() => {
        setCurrentIndex(imageIndex);
    }, [imageIndex]);

    if (!visible) return null;

    const currentImage = images[currentIndex]?.uri || images[0]?.uri;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
                    <Ionicons name="close" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {currentImage ? (
                    <Image source={{ uri: currentImage }} style={styles.image} resizeMode="contain" />
                ) : null}

                {images.length > 1 && (
                    <View style={styles.controls}>
                        <TouchableOpacity
                            disabled={currentIndex === 0}
                            onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                            style={[styles.navButton, currentIndex === 0 && styles.disabledNav]}
                        >
                            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        <Text style={styles.counterText}>
                            {currentIndex + 1} / {images.length}
                        </Text>

                        <TouchableOpacity
                            disabled={currentIndex === images.length - 1}
                            onPress={() => setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1))}
                            style={[styles.navButton, currentIndex === images.length - 1 && styles.disabledNav]}
                        >
                            <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    image: {
        width,
        height: height * 0.75,
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
    },
    navButton: {
        padding: 5,
    },
    disabledNav: {
        opacity: 0.3,
    },
    counterText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
