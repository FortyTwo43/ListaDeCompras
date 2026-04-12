import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';
import { SelectionHeader } from '../SelectionHeader';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

const mockTheme = {
  surface: '#1C1C24',
  border: '#2A2A35',
  text: '#EFEFEF',
  textSecondary: '#A0A0A0',
};

const defaultProps = {
  newItemName: '',
  onNewItemNameChange: jest.fn(),
  onBackPress: jest.fn(),
  onAddPress: jest.fn(),
  theme: mockTheme,
};

describe('SelectionHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<SelectionHeader {...defaultProps} />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the current newItemName value in the text input', () => {
    const { getByDisplayValue } = render(
      <SelectionHeader {...defaultProps} newItemName="Milk" />
    );
    expect(getByDisplayValue('Milk')).toBeTruthy();
  });

  it('calls onNewItemNameChange when text input changes', () => {
    const onChangeMock = jest.fn();
    const { getByDisplayValue } = render(
      <SelectionHeader {...defaultProps} newItemName="Milk" onNewItemNameChange={onChangeMock} />
    );
    fireEvent.changeText(getByDisplayValue('Milk'), 'Butter');
    expect(onChangeMock).toHaveBeenCalledWith('Butter');
  });

  it('calls onBackPress when back button is pressed', () => {
    const onBackMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <SelectionHeader {...defaultProps} onBackPress={onBackMock} />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[0]);
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('calls onAddPress when add button is pressed', () => {
    const onAddMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <SelectionHeader {...defaultProps} onAddPress={onAddMock} />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    // Add button is the last touchable
    fireEvent.press(touchables[touchables.length - 1]);
    expect(onAddMock).toHaveBeenCalledTimes(1);
  });

  it('renders add button with reduced opacity when newItemName is empty', () => {
    const { UNSAFE_getAllByType } = render(<SelectionHeader {...defaultProps} newItemName="" />);
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const addButton = touchables[touchables.length - 1];
    // Flatten the style array to find the opacity
    const styles = [].concat(addButton.props.style);
    const opacityStyle = styles.find((s: any) => s && 'opacity' in s);
    expect(opacityStyle?.opacity).toBe(0.5);
  });

  it('renders add button with full opacity when newItemName is not empty', () => {
    const { UNSAFE_getAllByType } = render(
      <SelectionHeader {...defaultProps} newItemName="Banana" />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const addButton = touchables[touchables.length - 1];
    const styles = [].concat(addButton.props.style);
    const opacityStyle = styles.find((s: any) => s && 'opacity' in s);
    expect(opacityStyle?.opacity).toBe(1);
  });

  it('renders add button with reduced opacity for whitespace-only newItemName', () => {
    const { UNSAFE_getAllByType } = render(
      <SelectionHeader {...defaultProps} newItemName="   " />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    const addButton = touchables[touchables.length - 1];
    const styles = [].concat(addButton.props.style);
    const opacityStyle = styles.find((s: any) => s && 'opacity' in s);
    // Whitespace-only should be treated as empty (trim())
    expect(opacityStyle?.opacity).toBe(0.5);
  });

  it('applies theme colors to header background and border', () => {
    const { UNSAFE_getByType } = render(<SelectionHeader {...defaultProps} />);
    const { View } = require('react-native');
    const views = render(<SelectionHeader {...defaultProps} />).UNSAFE_getAllByType(View);
    // The outermost view should have the surface background
    const outerView = views[0];
    const flatStyle = [].concat(outerView.props.style);
    const bgStyle = flatStyle.find((s: any) => s && s.backgroundColor);
    expect(bgStyle?.backgroundColor).toBe(mockTheme.surface);
  });

  it('renders exactly two TouchableOpacity buttons (back and add)', () => {
    const { UNSAFE_getAllByType } = render(<SelectionHeader {...defaultProps} />);
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    expect(touchables.length).toBe(2);
  });
});