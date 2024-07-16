import React from 'react';
import {
  View,
  Modal,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';

export default function TodoEditor({
  isVisible,
  title,
  details,
  image,
  onChangeTitle,
  onChangeDetails,
  onChangeImage,
  onSave,
  onCancel,
}) {
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(isVisible);

  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setModalVisible(false));
    }
  }, [isVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal transparent={true} animationType="none" visible={modalVisible}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.modalContainer, { transform: [{ translateY }] }]}
            >
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={onChangeTitle}
                  placeholder="Todo"
                />
                <TextInput
                  style={styles.input}
                  value={details}
                  onChangeText={onChangeDetails}
                  placeholder="Details"
                />
                <TextInput
                  style={styles.input}
                  value={image}
                  onChangeText={onChangeImage}
                  placeholder="Image URL"
                />
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : null}
                <Button title="Save" onPress={onSave} />
                <Button title="Cancel" onPress={onCancel} />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '50%',
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalContent: {
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 100,
    marginBottom: 10,
  },
});
