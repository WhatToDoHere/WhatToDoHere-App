import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Modal,
  Alert,
  Linking,
  AppState,
  Pressable,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ImagePickerButton({ onImageSelected, initialImage }) {
  const [image, setImage] = useState(initialImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullScreenModalVisible, setFullScreenModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const buttonRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (initialImage) {
      setImage(initialImage);
    }
  }, [initialImage]);

  const checkPermissions = useCallback(async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== 'granted' ||
      libraryPermission.status !== 'granted'
    ) {
      Alert.alert(
        '권한 필요',
        '카메라와 사진 라이브러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정', onPress: () => Linking.openSettings() },
        ],
      );
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkPermissions();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);

  const pickImage = async () => {
    if (image) {
      setFullScreenModalVisible(true);
    } else {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setModalPosition({
          top: py + height - 100,
          left: px + width - 50,
        });
        setModalVisible(true);
      });
    }
  };

  const handleImageLibrary = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 라이브러리 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  const handleCamera = async () => {
    setModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
    onImageSelected(null);
  };

  return (
    <View>
      <Pressable ref={buttonRef} style={styles.imageButton} onPress={pickImage}>
        {image ? (
          <View>
            <Image source={{ uri: image }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Image
                source={require('../assets/icons/icon-remove-photo.png')}
                style={styles.removeImageIcon}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={require('../assets/icons/icon-add-photo.png')}
            style={styles.addImageIcon}
          />
        )}
      </Pressable>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                position: 'absolute',
                top: modalPosition.top,
                left: modalPosition.left,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleImageLibrary}
            >
              <Text style={styles.modalText}>사진 선택</Text>
              <Image
                source={require('../assets/icons/icon-album.png')}
                style={styles.albumIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { borderBottomWidth: 0 }]}
              onPress={handleCamera}
            >
              <Text style={styles.modalText}>사진 찍기</Text>
              <Image
                source={require('../assets/icons/icon-camera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        animationType="fade"
        transparent={true}
        visible={fullScreenModalVisible}
        onRequestClose={() => setFullScreenModalVisible(false)}
      >
        <View style={styles.fullScreenModalContainer}>
          <Image source={{ uri: image }} style={styles.fullScreenImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setFullScreenModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  imageButton: {
    position: 'relative',
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  addImageIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -10,
    marginTop: -10,
    width: 20,
    height: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'transparent',
  },
  removeImageIcon: {
    width: 25,
    height: 25,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    width: 170,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#202020',
    color: '#fff',
  },
  modalButton: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: 13,
    borderBottomWidth: 0.5,
    borderBottomColor: '#707070',
  },
  modalText: {
    color: '#fff',
  },
  albumIcon: {
    width: 14,
    height: 14,
  },
  cameraIcon: {
    width: 14,
    height: 12.38,
    marginTop: 2,
  },
  fullScreenModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
