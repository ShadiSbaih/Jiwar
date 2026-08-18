import { Platform } from 'react-native';
import NativeViewer from './ImageViewerModal.native';
import WebViewer from './ImageViewerModal.web';

const ImageViewerModal = Platform.OS === 'web' ? WebViewer : NativeViewer;

export default ImageViewerModal;
