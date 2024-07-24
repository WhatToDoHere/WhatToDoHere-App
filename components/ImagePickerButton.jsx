import { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const ImagePickerButton = ({ onImageSelected, initialImage }) => {
  const [image, setImage] = useState(initialImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

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
    setModalVisible(true);
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
      <Pressable
        style={styles.imageButton}
        onPress={pickImage}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setButtonPosition({ x, y, width, height });
        }}
      >
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
                top: buttonPosition.y + buttonPosition.height + 230,
                left: buttonPosition.x + buttonPosition.width - 150,
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
    </View>
  );
};

const styles = StyleSheet.create({
  imageButton: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  addImageIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -15,
    marginTop: -15,
    width: 30,
    height: 30,
  },
  imagePreview: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'transparent',
  },
  removeImageIcon: {
    width: 30,
    height: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContent: {
    width: 150,
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
});
