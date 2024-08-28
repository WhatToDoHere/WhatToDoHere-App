import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import FriendLocationItem from './FriendLocationItem';

jest.mock('./FriendTodoItem', () => 'FriendTodoItem');

describe('FriendLocationItem', () => {
  const mockLocation = {
    id: '1',
    alias: 'Test Location',
    address: 'Test Address',
    todos: [
      { id: '1', title: 'Todo 1', assignedBy: 'mockUserId' },
      { id: '2', title: 'Todo 2', assignedBy: 'mockUserId' },
      { id: '3', title: 'Todo 3', assignedBy: 'otherUserId' },
    ],
  };

  const mockBackgroundColor = '#FFFFFF';

  it('위치 정보와 추가 버튼을 올바르게 렌더링합니다.', () => {
    const { getByText, queryByText } = render(
      <FriendLocationItem
        location={mockLocation}
        backgroundColor={mockBackgroundColor}
      />,
    );

    expect(getByText('Test Location')).toBeTruthy();
    expect(getByText('📍 Test Address')).toBeTruthy();
    expect(getByText('What to do here?')).toBeTruthy();
    expect(queryByText('Todo 3')).toBeNull(); // This todo should not be rendered
  });

  it('"What to do here?" 버튼 클릭 시 todo 추가 화면으로 이동합니다.', () => {
    const mockNavigate = jest.fn();
    jest
      .spyOn(require('expo-router'), 'useNavigation')
      .mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(
      <FriendLocationItem
        location={mockLocation}
        backgroundColor={mockBackgroundColor}
      />,
    );

    const addTodoButton = getByText('What to do here?');
    fireEvent.press(addTodoButton);

    expect(mockNavigate).toHaveBeenCalledWith('todo/index', {
      mode: 'add',
      locationId: '1',
      isFriendTodo: true,
    });
  });

  it('현재 사용자가 할당한 todo만 렌더링합니다.', () => {
    const { getAllByTestId } = render(
      <FriendLocationItem
        location={mockLocation}
        backgroundColor={mockBackgroundColor}
      />,
    );

    const todoItems = getAllByTestId('friend-todo-item');
    expect(todoItems).toHaveLength(2);
  });
});
