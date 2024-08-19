import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AddLocationButton from './AddLocationButton';

// Mock the image asset
jest.mock('../assets/icons/icon-add.png', () => 'mocked-image-source');

describe('AddLocationButton', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AddLocationButton onPress={() => {}} />);
    const button = getByTestId('add-location-button');
    expect(button).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(<AddLocationButton onPress={mockOnPress} />);
    const button = getByTestId('add-location-button');

    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('has correct style', () => {
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

  it('renders the add icon', () => {
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
