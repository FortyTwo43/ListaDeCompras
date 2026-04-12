import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FlatList, TouchableOpacity } from 'react-native';
import { CatalogList, CatalogItem } from '../CatalogList';

// Mock @expo/vector-icons used inside ItemRow
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

const mockTheme = {
  primary: '#474358',
  background: '#13131A',
  surface: '#1C1C24',
  text: '#EFEFEF',
  textSecondary: '#A0A0A0',
  border: '#2A2A35',
};

interface TestItem extends CatalogItem {
  id: string;
  nombre: string;
}

const sampleData: TestItem[] = [
  { id: '1', nombre: 'Apple' },
  { id: '2', nombre: 'Banana' },
  { id: '3', nombre: 'Cherry' },
];

const defaultProps = {
  data: sampleData,
  refreshing: false,
  onRefresh: jest.fn(),
  onDelete: jest.fn(),
  onRowPress: jest.fn(),
  isDark: true,
  theme: mockTheme,
};

describe('CatalogList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<CatalogList {...defaultProps} />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders all items from data', () => {
    const { getByText } = render(<CatalogList {...defaultProps} />);
    expect(getByText('Apple')).toBeTruthy();
    expect(getByText('Banana')).toBeTruthy();
    expect(getByText('Cherry')).toBeTruthy();
  });

  it('calls onRowPress with the correct item when a row is pressed', () => {
    const onRowPressMock = jest.fn();
    const { getByText } = render(
      <CatalogList {...defaultProps} onRowPress={onRowPressMock} />
    );
    fireEvent.press(getByText('Banana'));
    expect(onRowPressMock).toHaveBeenCalledWith(sampleData[1]);
  });

  it('calls onDelete with the correct item when delete icon is pressed', () => {
    const onDeleteMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <CatalogList {...defaultProps} onDelete={onDeleteMock} />
    );
    // Each ItemRow has one inner delete TouchableOpacity
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    // First item has 2 touchables (row + delete), delete is at index 1
    fireEvent.press(touchables[1]);
    expect(onDeleteMock).toHaveBeenCalledWith(sampleData[0]);
  });

  it('renders an empty list without crashing when data is empty', () => {
    const { toJSON } = render(<CatalogList {...defaultProps} data={[]} />);
    expect(toJSON()).not.toBeNull();
  });

  it('passes isDark prop to ItemRow (dark theme text color applied)', () => {
    const { getByText } = render(<CatalogList {...defaultProps} isDark={true} />);
    const textEl = getByText('Apple');
    // In dark mode ItemRow uses Colors.dark.textSecondary = '#A0A0A0'
    const flatStyle = [].concat(textEl.props.style);
    const colorStyle = flatStyle.find((s: any) => s && s.color);
    expect(colorStyle?.color).toBe('#A0A0A0');
  });

  it('passes isDark=false to ItemRow (light theme text color applied)', () => {
    const { getByText } = render(<CatalogList {...defaultProps} isDark={false} />);
    const textEl = getByText('Apple');
    const flatStyle = [].concat(textEl.props.style);
    const colorStyle = flatStyle.find((s: any) => s && s.color);
    // light theme uses textSecondary: '#4e4c4cff'
    expect(colorStyle?.color).toBe('#4e4c4cff');
  });

  it('passes the correct refreshControl props to FlatList', () => {
    const { UNSAFE_getByType } = render(
      <CatalogList {...defaultProps} refreshing={false} />
    );
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.refreshControl).toBeTruthy();
    expect(flatList.props.refreshControl.props.refreshing).toBe(false);
    expect(flatList.props.refreshControl.props.colors).toEqual([mockTheme.primary]);
    expect(flatList.props.refreshControl.props.tintColor).toBe(mockTheme.primary);
  });

  it('calls onRefresh when RefreshControl triggers refresh', () => {
    const onRefreshMock = jest.fn();
    const { UNSAFE_getByType } = render(
      <CatalogList {...defaultProps} onRefresh={onRefreshMock} refreshing={false} />
    );
    const flatList = UNSAFE_getByType(FlatList);
    flatList.props.refreshControl.props.onRefresh();
    expect(onRefreshMock).toHaveBeenCalledTimes(1);
  });

  it('renders items with extended type properties beyond CatalogItem', () => {
    interface ExtendedItem extends CatalogItem {
      category: string;
    }
    const extendedData: ExtendedItem[] = [
      { id: 'ext-1', nombre: 'Milk', category: 'Dairy' },
    ];
    const { getByText } = render(
      <CatalogList
        data={extendedData}
        refreshing={false}
        onRefresh={jest.fn()}
        onDelete={jest.fn()}
        onRowPress={jest.fn()}
        isDark={true}
        theme={mockTheme}
      />
    );
    expect(getByText('Milk')).toBeTruthy();
  });

  it('sets contentContainerStyle with paddingBottom: 100', () => {
    const { UNSAFE_getByType } = render(<CatalogList {...defaultProps} />);
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.contentContainerStyle).toEqual({ paddingBottom: 100 });
  });

  it('uses item.id as the key extractor', () => {
    const { UNSAFE_getByType } = render(<CatalogList {...defaultProps} />);
    const flatList = UNSAFE_getByType(FlatList);
    // keyExtractor should return the item id
    expect(flatList.props.keyExtractor(sampleData[0])).toBe('1');
    expect(flatList.props.keyExtractor(sampleData[2])).toBe('3');
  });
});