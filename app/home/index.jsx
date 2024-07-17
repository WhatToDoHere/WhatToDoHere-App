import { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { useNavigation } from 'expo-router';

import Header from '../../components/Header';
import LocationList from '../../components/LocationList';
import TodoEditor from '../../components/TodoEditor';
import AddLocationButton from '../../components/AddLocationButton';

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

  const navigation = useNavigation();

  const handleSave = () => {
    if (currentTodo && currentTodo.onTodoEdit) {
      currentTodo.onTodoEdit(modalTitle, modalDetails, modalImage);
    }
    setIsModalVisible(false);
  };

  const handleAdd = () => {
    navigation.navigate('location/index');
  };

  return (
    <View style={styles.container}>
      <Header isLoggedIn={isLoggedIn} />

      <LocationList openTodoEditor={openTodoEditor}></LocationList>

      <AddLocationButton onPress={handleAdd} />

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
});
