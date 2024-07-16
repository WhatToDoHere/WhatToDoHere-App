import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import Header from '../../components/Header';
import LocationList from '../../components/LocationList';
import TodoEditor from '../../components/TodoEditor';

export default function HomeScreen() {
  const isLoggedIn = true;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalDetails, setModalDetails] = useState('');
  const [modalImage, setModalImage] = useState('');
  const [currentTodo, setCurrentTodo] = useState(null);

  const openTodoEditor = (todo, onTodoEdit) => {
    setCurrentTodo({ ...todo, onTodoEdit });
    setModalTitle(todo.title);
    setModalDetails(todo.details);
    setModalImage(todo.image);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (currentTodo && currentTodo.onTodoEdit) {
      currentTodo.onTodoEdit(modalTitle, modalDetails, modalImage);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} />

      <LocationList openTodoEditor={openTodoEditor}></LocationList>

      <TouchableOpacity style={styles.addButton}>
        {/* <MaterialIcons name="add" size={24} color="white" /> */}
      </TouchableOpacity>

      <TodoEditor
        isVisible={isModalVisible}
        title={modalTitle}
        details={modalDetails}
        image={modalImage}
        onChangeTitle={setModalTitle}
        onChangeDetails={setModalDetails}
        onChangeImage={setModalImage}
        onSave={handleSave}
        onCancel={() => setIsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
});
