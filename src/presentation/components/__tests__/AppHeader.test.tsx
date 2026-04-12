import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { TouchableOpacity, TextInput } from 'react-native';
import { AppHeader } from '../AppHeader';

// Mock external dependencies
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useAppTheme: () => ({
    theme: {
      surface: '#1C1C24',
      border: '#2A2A35',
      text: '#EFEFEF',
      textSecondary: '#A0A0A0',
      background: '#13131A',
      primary: '#474358',
    },
  }),
}));

// Helper to build BottomTabHeaderProps-like object
function buildProps(overrides: Record<string, any> = {}) {
  return {
    options: {
      title: 'My Title',
      ...overrides,
    },
    navigation: {} as any,
    route: {} as any,
    layout: { width: 375, height: 812 },
  } as any;
}

describe('AppHeader', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<AppHeader {...buildProps()} />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the title from options', () => {
    const { getByText } = render(<AppHeader {...buildProps({ title: 'Shopping Lists' })} />);
    expect(getByText('Shopping Lists')).toBeTruthy();
  });

  it('does not show a search input initially', () => {
    const { UNSAFE_queryAllByType } = render(
      <AppHeader {...buildProps({ onSearch: jest.fn(), placeholder: 'Search...' })} />
    );
    const inputs = UNSAFE_queryAllByType(TextInput);
    expect(inputs.length).toBe(0);
  });

  it('shows a search icon button when onSearch is provided', () => {
    const { UNSAFE_getAllByType } = render(
      <AppHeader {...buildProps({ onSearch: jest.fn() })} />
    );
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('does not show any TouchableOpacity buttons when onSearch and headerLeft/headerRight are not provided', () => {
    const { UNSAFE_queryAllByType } = render(<AppHeader {...buildProps()} />);
    const buttons = UNSAFE_queryAllByType(TouchableOpacity);
    expect(buttons.length).toBe(0);
  });

  it('enters search mode and shows text input when search button is pressed', async () => {
    const onSearchMock = jest.fn();
    const { UNSAFE_getAllByType, UNSAFE_queryAllByType } = render(
      <AppHeader {...buildProps({ onSearch: onSearchMock, placeholder: 'Search items...' })} />
    );

    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
      jest.runAllTimers();
    });

    await waitFor(() => {
      const inputs = UNSAFE_queryAllByType(TextInput);
      expect(inputs.length).toBe(1);
    });
  });

  it('hides title when in search mode', async () => {
    const { UNSAFE_getAllByType, queryByText } = render(
      <AppHeader {...buildProps({ title: 'My Lists', onSearch: jest.fn() })} />
    );

    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(queryByText('My Lists')).toBeNull();
    });
  });

  it('calls onSearch with typed text during search', async () => {
    const onSearchMock = jest.fn();
    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <AppHeader {...buildProps({ onSearch: onSearchMock, placeholder: 'Search...' })} />
    );

    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(() => UNSAFE_getByType(TextInput)).not.toThrow();
    });

    const input = UNSAFE_getByType(TextInput);
    fireEvent.changeText(input, 'Apple');
    expect(onSearchMock).toHaveBeenCalledWith('Apple');
  });

  it('exits search mode when back arrow is pressed and calls onSearch with empty string', async () => {
    const onSearchMock = jest.fn();
    const { UNSAFE_getAllByType, UNSAFE_queryAllByType } = render(
      <AppHeader {...buildProps({ onSearch: onSearchMock, placeholder: 'Search...' })} />
    );

    let buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]); // open search
      jest.runAllTimers();
    });

    await waitFor(() => {
      const inputs = UNSAFE_queryAllByType(TextInput);
      expect(inputs.length).toBe(1);
    });

    // Back arrow is the first button in search mode
    buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
    });

    await waitFor(() => {
      const inputs = UNSAFE_queryAllByType(TextInput);
      expect(inputs.length).toBe(0);
    });

    expect(onSearchMock).toHaveBeenLastCalledWith('');
  });

  it('renders headerRight slot when not in search mode', () => {
    const headerRightFn = jest.fn().mockReturnValue(null);
    render(
      <AppHeader {...buildProps({ headerRight: headerRightFn })} />
    );
    expect(headerRightFn).toHaveBeenCalled();
  });

  it('renders headerLeft slot when provided', () => {
    const headerLeftFn = jest.fn().mockReturnValue(null);
    render(
      <AppHeader {...buildProps({ headerLeft: headerLeftFn })} />
    );
    expect(headerLeftFn).toHaveBeenCalled();
  });

  it('applies safe area insets as paddingTop to the container', () => {
    const { UNSAFE_getAllByType } = render(<AppHeader {...buildProps()} />);
    const { View } = require('react-native');
    const views = UNSAFE_getAllByType(View);
    // The outermost view should have paddingTop: 44 from useSafeAreaInsets
    const outerView = views[0];
    const flatStyle = [].concat(outerView.props.style);
    const paddingStyle = flatStyle.find((s: any) => s && 'paddingTop' in s);
    expect(paddingStyle?.paddingTop).toBe(44);
  });

  it('uses default placeholder text "Buscar..." when not overridden', async () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <AppHeader {...buildProps({ onSearch: jest.fn() })} />
    );

    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(() => UNSAFE_getByType(TextInput)).not.toThrow();
    });

    const input = UNSAFE_getByType(TextInput);
    expect(input.props.placeholder).toBe('Buscar...');
  });

  it('uses custom placeholder text when provided', async () => {
    const { UNSAFE_getAllByType, UNSAFE_getByType } = render(
      <AppHeader {...buildProps({ onSearch: jest.fn(), placeholder: 'Find something...' })} />
    );

    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    await act(async () => {
      fireEvent.press(buttons[0]);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(() => UNSAFE_getByType(TextInput)).not.toThrow();
    });

    const input = UNSAFE_getByType(TextInput);
    expect(input.props.placeholder).toBe('Find something...');
  });

  it('renders empty title gracefully when title is not provided', () => {
    const { toJSON } = render(<AppHeader {...buildProps({ title: undefined })} />);
    expect(toJSON()).not.toBeNull();
  });
});