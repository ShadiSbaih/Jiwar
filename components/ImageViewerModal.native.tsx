import React from 'react';
import ImageViewing from 'react-native-image-viewing';

interface ImageViewerModalProps {
    images: { uri: string }[];
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;
}

export default function ImageViewerModal({
    images,
    imageIndex,
    visible,
    onRequestClose,
}: ImageViewerModalProps) {
    return (
        <ImageViewing
            images={images}
            imageIndex={imageIndex}
            visible={visible}
            onRequestClose={onRequestClose}
        />
    );
}
