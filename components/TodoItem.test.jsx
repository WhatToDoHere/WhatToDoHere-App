import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import TodoItem from './TodoItem';
import { getUserInfo } from '../services/firebaseService';

describe('TodoItem', () => {
  const mockTodo = {
    id: '1',
    title: 'Test Todo',
    completed: false,
    locationId: 'testLocation',
    assignedBy: 'friendUserId',
  };

  const mockOnCheckBoxToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('할 일 항목을 올바르게 렌더링합니다.', async () => {
    const { getByText } = render(
      <TodoItem todo={mockTodo} onCheckBoxToggle={mockOnCheckBoxToggle} />,
    );
    await waitFor(() => {
      expect(getByText('Test Todo')).toBeTruthy();
    });
  });

  it('체크박스 클릭 시 할 일 완료 여부를 토글합니다.', async () => {
    const { getByTestId } = render(
      <TodoItem todo={mockTodo} onCheckBoxToggle={mockOnCheckBoxToggle} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('checkbox'));
    });

    expect(mockOnCheckBoxToggle).toHaveBeenCalledWith('1', true);
  });

  it('다른 사용자가 할당한 경우 해당 사용자의 이름을 가져와 표시합니다.', async () => {
    getUserInfo.mockResolvedValue({ name: 'Test Friend' });

    const { getByText } = render(
      <TodoItem todo={mockTodo} onCheckBoxToggle={mockOnCheckBoxToggle} />,
    );

    await waitFor(() => {
      expect(getByText('✍🏻 Test Friend')).toBeTruthy();
    });
  });

  it('친구 정보를 가져올 수 없을 때 "알 수 없는 사용자"로 표시합니다.', async () => {
    getUserInfo.mockResolvedValue(null);

    const { getByText } = render(
      <TodoItem todo={mockTodo} onCheckBoxToggle={mockOnCheckBoxToggle} />,
    );

    await waitFor(() => {
      expect(getByText('✍🏻 알 수 없는 사용자')).toBeTruthy();
    });
  });

  it('친구 정보 가져오기에 오류가 발생하면 "삭제된 계정"으로 표시합니다.', async () => {
    getUserInfo.mockRejectedValue(new Error('Test error'));

    const { getByText } = render(
      <TodoItem todo={mockTodo} onCheckBoxToggle={mockOnCheckBoxToggle} />,
    );

    await waitFor(() => {
      expect(getByText('✍🏻 삭제된 계정')).toBeTruthy();
    });
  });
});
