import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  LayoutAnimation,
} from 'react-native';
import { Stack, useNavigation } from 'expo-router';

import { useAtom } from 'jotai';
import { todoAtom } from '../../../../atoms';

import SwitchSelector from '../../../../components/SwitchSelector';
import TimePicker from '../../../../components/TimePicker';
import { requestNotificationPermission } from '../../../../utils/permission';

export default function SetReminderDetails() {
  const navigation = useNavigation();
  const [todo, setTodo] = useAtom(todoAtom);

  const [isReminderEnabled, setIsReminderEnabled] = useState(
    todo.reminder.isEnabled,
  );
  const [reminderOnArrival, setReminderOnArrival] = useState(
    todo.reminder.reminderOnArrival,
  );
  const [selectedHours, setSelectedHours] = useState(
    Math.floor(todo.reminder.delayMinutes / 60),
  );
  const [selectedMinutes, setSelectedMinutes] = useState(
    todo.reminder.delayMinutes % 60,
  );

  const [previewMessage, setPreviewMessage] = useState('');

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isReminderEnabled]);

  const updatePreviewMessage = useCallback(() => {
    if (!isReminderEnabled) {
      setPreviewMessage('알림 없음');
    } else {
      const triggerText = reminderOnArrival ? '도착' : '출발';
      let timeText = '즉시';
      if (selectedHours > 0 || selectedMinutes > 0) {
        timeText = '';
        if (selectedHours > 0) {
          timeText += `${selectedHours}시간 `;
        }
        if (selectedMinutes > 0) {
          timeText += `${selectedMinutes}분 `;
        }
        timeText += '후';
      }
      setPreviewMessage(`${triggerText} ${timeText} 알림`);
    }
  }, [isReminderEnabled, reminderOnArrival, selectedHours, selectedMinutes]);

  useEffect(() => {
    updatePreviewMessage();
  }, [updatePreviewMessage]);

  const toggleSwitch = () => {
    setIsReminderEnabled((prev) => !prev);
    updatePreviewMessage();
  };

  const handleTimeChange = (hours, minutes) => {
    setSelectedHours(hours);
    setSelectedMinutes(minutes);
    updatePreviewMessage();
  };

  const handleSaveReminderDetails = () => {
    setTodo((prevTodo) => ({
      ...prevTodo,
      reminder: {
        isEnabled: isReminderEnabled,
        reminderOnArrival: reminderOnArrival,
        delayMinutes: selectedHours * 60 + selectedMinutes,
      },
    }));
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: '알림 설정',
          headerTitleStyle: styles.headerTitle,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.headerLeft}>취소</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleSaveReminderDetails}>
              <Text style={styles.headerRight}>확인</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.contents}>
        <View style={[styles.sectionContainer, styles.flexContainer]}>
          <View style={[styles.titleContainer, styles.firstTitle]}>
            <Image
              source={require('../../../../assets/icons/icon-alert.png')}
              style={[styles.sectionIcon, styles.alertIcon]}
            />
            <Text style={styles.sectionTitle}>Reminder</Text>
          </View>
          <Switch
            trackColor={{ false: '#767577', true: '#F15858' }}
            thumbColor={isReminderEnabled ? '#fff' : '#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isReminderEnabled}
          />
        </View>

        {isReminderEnabled && (
          <View style={styles.expandableContent}>
            <View style={styles.sectionContainer}>
              <View style={styles.titleContainer}>
                <Image
                  source={require('../../../../assets/icons/icon-trigger.png')}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Trigger</Text>
              </View>
              <SwitchSelector
                options={[
                  { label: '도착할 때', value: true },
                  { label: '떠날 때', value: false },
                ]}
                selected={reminderOnArrival}
                onSelect={(value) => {
                  setReminderOnArrival(value);
                  updatePreviewMessage();
                }}
              />
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.titleContainer}>
                <Image
                  source={require('../../../../assets/icons/icon-reminder.png')}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>Timer</Text>
              </View>
              <View style={styles.timePickerContainer}>
                <TimePicker
                  selectedHours={selectedHours}
                  selectedMinutes={selectedMinutes}
                  onTimeChange={handleTimeChange}
                />
              </View>
            </View>
          </View>
        )}

        <Text style={styles.previewMessage}>⏰ {previewMessage}</Text>
      </View>
    </ScrollView>
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  contents: {
    paddingBottom: 50,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  firstTitle: {
    marginTop: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 15,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  alertIcon: {
    width: 14,
    height: 15,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: 'Opposit-Bold',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#202020',
  },
  timePickerContainer: {
    marginTop: -15,
  },
  expandableContent: {
    overflow: 'hidden',
  },
  previewMessage: {
    marginTop: 30,
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: '#5B84EF',
    textAlign: 'center',
  },
});
