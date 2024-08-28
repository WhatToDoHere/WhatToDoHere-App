import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import ImagePickerButton from './ImagePickerButton';
import * as ImagePicker from 'expo-image-picker';

describe('ImagePickerButton', () => {
  const mockOnImageSelected = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('초기 이미지 없이 올바르게 렌더링합니다.', () => {
    const { getByTestId } = render(
      <ImagePickerButton onImageSelected={mockOnImageSelected} />,
    );
    expect(getByTestId('add-image-icon')).toBeTruthy();
  });

  it('초기 이미지와 함께 올바르게 렌더링합니다.', () => {
    const { getByTestId } = render(
      <ImagePickerButton
        onImageSelected={mockOnImageSelected}
        initialImage="test-image-url"
      />,
    );
    expect(getByTestId('image-preview')).toBeTruthy();
  });

  it('이미지 없이 버튼을 누르면 모달을 엽니다.', async () => {
    const { getByTestId, queryByTestId, debug } = render(
      <ImagePickerButton onImageSelected={mockOnImageSelected} />,
    );

    debug();

    await act(async () => {
      fireEvent.press(getByTestId('image-button'));
    });

    debug();

    await waitFor(
      () => {
        expect(queryByTestId('modal-content')).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it('이미지가 있을 때 버튼을 누르면 전체 화면 모달을 엽니다.', async () => {
    const { getByTestId, queryByTestId } = render(
      <ImagePickerButton
        onImageSelected={mockOnImageSelected}
        initialImage="test-image-url"
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('image-button'));
    });

    await waitFor(() => {
      expect(queryByTestId('full-screen-modal')).toBeTruthy();
    });
  });

  it('라이브러리에서 이미지를 선택하면 onImageSelected를 호출합니다.', async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'new-image-url' }],
    };
    ImagePicker.launchImageLibraryAsync.mockResolvedValue(mockResult);

    const { getByTestId, queryByText } = render(
      <ImagePickerButton onImageSelected={mockOnImageSelected} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('image-button'));
    });

    await waitFor(
      () => {
        expect(queryByText('사진 선택')).toBeTruthy();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.press(queryByText('사진 선택'));
    });

    await waitFor(() => {
      expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
      expect(mockOnImageSelected).toHaveBeenCalledWith('new-image-url');
    });
  });

  it('카메라로 이미지를 촬영하면 onImageSelected를 호출합니다.', async () => {
    const mockResult = {
      canceled: false,
      assets: [{ uri: 'camera-image-url' }],
    };
    ImagePicker.launchCameraAsync.mockResolvedValue(mockResult);

    const { getByTestId, queryByText } = render(
      <ImagePickerButton onImageSelected={mockOnImageSelected} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('image-button'));
    });

    await waitFor(
      () => {
        expect(queryByText('사진 찍기')).toBeTruthy();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      fireEvent.press(queryByText('사진 찍기'));
    });

    await waitFor(() => {
      expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
      expect(mockOnImageSelected).toHaveBeenCalledWith('camera-image-url');
    });
  });

  it('이미지 제거 버튼을 누르면 이미지를 제거합니다.', async () => {
    const { getByTestId } = render(
      <ImagePickerButton
        onImageSelected={mockOnImageSelected}
        initialImage="test-image-url"
      />,
    );

    await act(async () => {
      fireEvent.press(getByTestId('remove-image-button'));
    });

    expect(mockOnImageSelected).toHaveBeenCalledWith(null);
  });

  it('마운트 시 권한을 확인합니다.', async () => {
    render(<ImagePickerButton onImageSelected={mockOnImageSelected} />);

    await waitFor(() => {
      expect(ImagePicker.requestCameraPermissionsAsync).toHaveBeenCalled();
      expect(
        ImagePicker.requestMediaLibraryPermissionsAsync,
      ).toHaveBeenCalled();
    });
  });
});
