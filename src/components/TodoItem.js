import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';

export default function TodoItem({ text, onCheckBoxToggle, onTextEdit }) {
  const [checked, setChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleCheckBoxToggle = () => {
    setChecked(!checked);
    onCheckBoxToggle();
  };

  const handleTextEdit = () => {
    setIsModalVisible(true);
  };

  const handleSave = () => {
    onTextEdit(editedText);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.todoItem}>
      <TouchableOpacity onPress={handleCheckBoxToggle} style={styles.checkBox}>
        <View style={[styles.checkBoxInner, checked && styles.checked]} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleTextEdit} style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={editedText}
              onChangeText={setEditedText}
            />
            <Button title="Save" onPress={handleSave} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxInner: {
    width: 16,
    height: 16,
  },
  checked: {
    backgroundColor: '#000',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
});
