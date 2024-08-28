import { render, fireEvent } from '@testing-library/react-native';
import LocationItem from './LocationItem';

jest.mock('./TodoItem', () => 'TodoItem');

const mockNavigate = jest.fn();
jest.mock('expo-router', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

describe('LocationItem', () => {
  const mockLocation = {
    id: '1',
    alias: 'Test Location',
    address: 'Test Address',
    todos: [
      { id: '1', title: 'Todo 1', completed: false },
      { id: '2', title: 'Todo 2', completed: false },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('위치 정보와 버튼들을 올바르게 렌더링합니다.', () => {
    const { getByText, getByTestId } = render(
      <LocationItem location={mockLocation} />,
    );
    expect(getByText('Test Location')).toBeTruthy();
    expect(getByText('📍 Test Address')).toBeTruthy();
    expect(getByTestId('toggle-button')).toBeTruthy();
    expect(getByTestId('edit-button')).toBeTruthy();
  });

  it('수정 버튼 클릭 시 위치 수정 화면으로 이동합니다.', () => {
    const { getByTestId } = render(<LocationItem location={mockLocation} />);
    const editButton = getByTestId('edit-button');

    fireEvent.press(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('location/index', {
      mode: 'edit',
      location: JSON.stringify(mockLocation),
    });
  });

  it('"What to do here?" 버튼 클릭 시 할 일 추가 화면으로 이동합니다.', () => {
    const { getByText } = render(<LocationItem location={mockLocation} />);
    const addTodoButton = getByText('What to do here?');

    fireEvent.press(addTodoButton);

    expect(mockNavigate).toHaveBeenCalledWith('todo/index', {
      mode: 'add',
      locationId: mockLocation.id,
    });
  });

  it('할 일 목록을 올바르게 렌더링합니다.', () => {
    const { getAllByTestId } = render(<LocationItem location={mockLocation} />);
    const todoItems = getAllByTestId('todo-item');
    expect(todoItems).toHaveLength(2);
    todoItems.forEach((item, index) => {
      expect(item.props.todo).toEqual(mockLocation.todos[index]);
    });
  });
});
