import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, useNavigation, useLocalSearchParams } from 'expo-router';

import { useAtom } from 'jotai';
import { userInfoAtom, locationsAtom } from '../../../atoms';

import {
  addTodo,
  updateTodo,
  uploadImage,
  getTodo,
} from '../../../utils/firebaseService';

import { CustomTextInput } from '../../../components/CustomTextInput';
import { ImagePickerButton } from '../../../components/ImagePickerButton';

export default function TodoForm() {
  const [userInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);

  const navigation = useNavigation();
  const { mode, locationId, todoId } = useLocalSearchParams();
  const [todoTitle, setTodoTitle] = useState('');
  const [todoMemo, setTodoMemo] = useState('');
  const [todoImage, setTodoImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTodoData = async () => {
      const todo = await getTodo(locationId, todoId);

      if (todo) {
        setTodoTitle(todo.title);
        setTodoMemo(todo.memo);
        setTodoImage(todo.image);
      }
    };

    if (mode === 'edit' && todoId) {
      fetchTodoData();
    }
  }, [mode, locationId, todoId]);

  const handleImageSelected = (imageUri) => {
    setTodoImage(imageUri);
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      let imageUploadPromise = Promise.resolve(todoImage);
      if (todoImage && todoImage.startsWith('file://')) {
        imageUploadPromise = uploadImage(todoImage);
      }

      const todoData = {
        title: todoTitle,
        memo: todoMemo,
        notifyOnArrival: true,
        notifyOnDeparture: false,
        locationId: locationId,
        assignedBy: userInfo.uid,
      };

      const [imageUrl, saveResult] = await Promise.all([
        imageUploadPromise,
        mode === 'add'
          ? addTodo(locationId, { ...todoData, image: null }, setLocations)
          : updateTodo(
              locationId,
              todoId,
              { ...todoData, image: null },
              setLocations,
            ),
      ]);

      if (imageUrl !== todoImage) {
        await updateTodo(
          locationId,
          saveResult || todoId,
          { image: imageUrl },
          setLocations,
        );
      }

      Alert.alert(
        '성공',
        mode === 'add'
          ? '새로운 작업이 추가되었습니다.'
          : '작업이 수정되었습니다.',
      );
      navigation.goBack();
    } catch (error) {
      console.error('작업 저장 중 오류 발생:', error);
      Alert.alert('오류', '작업을 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: mode === 'edit' ? '할 일' : '할 일 등록',
          headerTitleStyle: {
            fontFamily: 'Pretendard-Regular',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerLeft}>취소</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSave} disabled={isLoading}>
              <Text style={styles.headerRight}>저장</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <View style={[styles.titleContainer, styles.firstTitle]}>
          <Image
            source={require('../../../assets/icons/icon-todo.png')}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Todo</Text>
        </View>
        <CustomTextInput
          value={todoTitle}
          onChangeText={setTodoTitle}
          placeholder="제목"
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-memo.png')}
            style={[styles.sectionIcon, styles.memoIcon]}
          />
          <Text style={styles.sectionTitle}>Memo</Text>
        </View>
        <CustomTextInput
          value={todoMemo}
          onChangeText={setTodoMemo}
          placeholder="메모"
          multiline={true}
        />
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/icon-photo.png')}
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Image</Text>
        </View>
        <ImagePickerButton
          onImageSelected={handleImageSelected}
          initialImage={todoImage}
        />
        {mode === 'edit' && (
          <TouchableOpacity style={styles.deleteButton}>
            <Image
              source={require('../../../assets/icons/icon-delete.png')}
              style={styles.deleteIcon}
            />
            <Text style={styles.deleteButtonText}>작업 삭제</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#F15858',
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  contents: {
    paddingBottom: 50,
  },
  firstTitle: {
    marginTop: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  memoIcon: {
    width: 22,
    height: 22,
    marginRight: 5,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Opposit-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
  },
  imageButton: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  imageButtonText: {
    fontSize: 40,
    color: '#888',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    // backgroundColor: '#F15858',
    borderRadius: 5,
    marginTop: 20,
  },
  deleteIcon: {
    width: 18,
    height: 18,
    marginTop: -2,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#F15858',
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
  },
});
