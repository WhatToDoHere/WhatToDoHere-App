import { useEffect } from 'react';
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
import { userInfoAtom, locationsAtom, todoAtom } from '../../../atoms';

import {
  getTodo,
  addTodo,
  updateTodo,
  uploadImage,
  deleteTodo,
} from '../../../utils/firebaseService';

import CustomTextInput from '../../../components/CustomTextInput';
import ImagePickerButton from '../../../components/ImagePickerButton';
import DeleteButton from '../../../components/DeleteButton';

export default function TodoForm() {
  const [userInfo] = useAtom(userInfoAtom);
  const [, setLocations] = useAtom(locationsAtom);
  const [todo, setTodo] = useAtom(todoAtom);

  const navigation = useNavigation();
  const { mode, locationId, todoId } = useLocalSearchParams();

  useEffect(() => {
    const fetchTodoData = async () => {
      const fetchedTodo = await getTodo(locationId, todoId);
      if (fetchedTodo) {
        setTodo(fetchedTodo);
      }
    };

    if (mode === 'edit' && todoId) {
      fetchTodoData();
    } else {
      setTodo({
        title: '',
        memo: '',
        image: null,
        reminder: {
          isEnabled: false,
          reminderOnArrival: true,
          delayMinutes: 0,
        },
        locationId: locationId,
        assignedBy: userInfo.uid,
      });
    }
  }, [mode, locationId, todoId, setTodo, userInfo.uid]);

  const handleImageSelected = (imageUri) => {
    setTodo((prevTodo) => ({ ...prevTodo, image: imageUri }));
  };

  const handleSave = async () => {
    try {
      let imageUrl = todo.image;
      if (todo.image && todo.image.startsWith('file://')) {
        imageUrl = await uploadImage(todo.image);
      }

      const todoData = {
        ...todo,
        image: imageUrl,
        locationId: locationId,
        assignedBy: userInfo.uid,
      };

      if (mode === 'add') {
        await addTodo(locationId, todoData, setLocations);
      } else {
        await updateTodo(locationId, todoId, todoData, setLocations);
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
    }
  };

  const getPreviewMessage = () => {
    if (!todo.reminder.isEnabled) return '알림 없음';
    const triggerText = todo.reminder.reminderOnArrival ? '도착' : '출발';
    let timeText = '즉시';
    if (todo.reminder.delayMinutes > 0) {
      const hours = Math.floor(todo.reminder.delayMinutes / 60);
      const minutes = todo.reminder.delayMinutes % 60;
      timeText = '';
      if (hours > 0) timeText += `${hours}시간 `;
      if (minutes > 0) timeText += `${minutes}분 `;
      timeText += '후';
    }
    return `${triggerText} ${timeText} 알림`;
  };

  const handleDelete = () => {
    Alert.alert(
      '삭제',
      '할 일을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: async () => {
            try {
              await deleteTodo(locationId, todoId, setLocations);
              Alert.alert('성공', '할 일이 삭제되었습니다.');
              navigation.goBack();
            } catch (error) {
              console.error('할 일 삭제 중 오류 발생:', error);
              Alert.alert('오류', '할 일을 삭제하는 중 오류가 발생했습니다.');
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            title: mode === 'edit' ? '할 일' : '할 일 등록',
            headerTitleStyle: styles.headerTitle,
            headerShadowVisible: false,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.headerLeft}>취소</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={handleSave}>
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
            value={todo.title}
            onChangeText={(text) =>
              setTodo((prevTodo) => ({ ...prevTodo, title: text }))
            }
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
            value={todo.memo}
            onChangeText={(text) =>
              setTodo((prevTodo) => ({ ...prevTodo, memo: text }))
            }
            placeholder="메모"
            multiline={true}
          />
          <View style={styles.titleContainer}>
            <Image
              source={require('../../../assets/icons/icon-settings.png')}
              style={[styles.sectionIcon, styles.settingsIcon]}
            />
            <Text style={styles.sectionTitle}>Reminder Options</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => {
              navigation.navigate('todo/setReminderDetails');
            }}
          >
            <Text style={styles.settingsText}>알림 설정</Text>
            <View style={styles.settingsRight}>
              <Text style={styles.previewMessage}>
                ⏰ {getPreviewMessage()}
              </Text>
              <Image
                source={require('../../../assets/icons/icon-next-blue.png')}
                style={styles.nextIcon}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Image
              source={require('../../../assets/icons/icon-image.png')}
              style={[styles.sectionIcon, styles.imageIcon]}
            />
            <Text style={styles.sectionTitle}>Image</Text>
          </View>
          <ImagePickerButton
            onImageSelected={handleImageSelected}
            initialImage={todo.image}
          />
        </View>
      </ScrollView>
      {mode === 'edit' && <DeleteButton onPress={handleDelete} />}
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
  },
  headerLeft: {
    paddingLeft: 5,
    fontSize: 16,
    color: '#F15858',
  },
  headerRight: {
    paddingRight: 5,
    fontSize: 16,
  },
  wrapper: {
    flex: 1,
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
    marginTop: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
  settingsIcon: {
    marginRight: 6,
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    padding: 10,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextIcon: {
    marginLeft: 15,
    width: 6,
    height: 10.91,
  },
  settingsText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    color: '#303030',
  },
  previewMessage: {
    marginVertical: 5,
    fontSize: 13,
    color: '#5B84EF',
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
});
