import { render, fireEvent } from '@testing-library/react-native';
import AddLocationButton from './AddLocationButton';

jest.mock('../assets/icons/icon-add.png', () => 'mocked-image-source');

describe('AddLocationButton', () => {
  it('AddLocationButton 컴포넌트가 올바르게 렌더링 됩니다.', () => {
    const { getByTestId } = render(<AddLocationButton onPress={() => {}} />);
    const button = getByTestId('add-location-button');
    expect(button).toBeTruthy();
  });

  it('버튼을 누르면 onPress 함수가 호출됩니다.', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<AddLocationButton onPress={mockOnPress} />);
    const button = getByTestId('add-location-button');

    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('올바른 스타일을 가지고 있습니다.', () => {
    const { getByTestId } = render(<AddLocationButton onPress={() => {}} />);
    const button = getByTestId('add-location-button');

    expect(button.props.style).toMatchObject({
      position: 'absolute',
      right: 20,
      bottom: 50,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#202020',
    });
  });

  it('추가 아이콘을 렌더링합니다.', () => {
    const { getByTestId } = render(<AddLocationButton onPress={() => {}} />);
    const icon = getByTestId('add-location-icon');

    expect(icon).toBeTruthy();
    expect(icon.props.source).toBe('mocked-image-source');
    expect(icon.props.style).toMatchObject({
      width: 20,
      height: 20,
    });
  });
});
