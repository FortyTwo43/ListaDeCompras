import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';
import { ArticuloRow } from '../ArticuloRow';
import { ListaArticulo } from '../../../domain';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

const pendingItem: ListaArticulo = {
  id: 'la-1',
  estado: 'pendiente',
  cantidad: 2,
  id_articulo: 'a-1',
  id_lista: 'l-1',
  id_medida: 'm-1',
};

const boughtItem: ListaArticulo = {
  ...pendingItem,
  id: 'la-2',
  estado: 'comprado',
};

const cancelledItem: ListaArticulo = {
  ...pendingItem,
  id: 'la-3',
  estado: 'cancelado',
};

const defaultProps = {
  item: pendingItem,
  nombreArticulo: 'Milk',
  nombreMedida: 'Liters',
  onToggleEstado: jest.fn(),
  onEdit: jest.fn(),
  onEditMeasure: jest.fn(),
  onDelete: jest.fn(),
  isDark: true,
};

describe('ArticuloRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { toJSON } = render(<ArticuloRow {...defaultProps} />);
    expect(toJSON()).not.toBeNull();
  });

  it('displays the article name', () => {
    const { getByText } = render(<ArticuloRow {...defaultProps} />);
    expect(getByText('Milk')).toBeTruthy();
  });

  it('displays the quantity and measure', () => {
    const { getByText } = render(<ArticuloRow {...defaultProps} />);
    expect(getByText('2 Liters')).toBeTruthy();
  });

  it('calls onToggleEstado when state icon is pressed', () => {
    const onToggleMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <ArticuloRow {...defaultProps} onToggleEstado={onToggleMock} />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(touchables[0]);
    expect(onToggleMock).toHaveBeenCalledTimes(1);
  });

  it('calls onEdit when article name row is pressed', () => {
    const onEditMock = jest.fn();
    const { getByText } = render(
      <ArticuloRow {...defaultProps} onEdit={onEditMock} />
    );
    fireEvent.press(getByText('Milk'));
    expect(onEditMock).toHaveBeenCalledTimes(1);
  });

  it('calls onEditMeasure when quantity/measure area is pressed', () => {
    const onEditMeasureMock = jest.fn();
    const { getByText } = render(
      <ArticuloRow {...defaultProps} onEditMeasure={onEditMeasureMock} />
    );
    fireEvent.press(getByText('2 Liters'));
    expect(onEditMeasureMock).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is pressed', () => {
    const onDeleteMock = jest.fn();
    const { UNSAFE_getAllByType } = render(
      <ArticuloRow {...defaultProps} onDelete={onDeleteMock} />
    );
    const touchables = UNSAFE_getAllByType(TouchableOpacity);
    // Delete button is the last TouchableOpacity
    fireEvent.press(touchables[touchables.length - 1]);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
  });

  it('renders quantity button as disabled when onEditMeasure is not provided', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} onEditMeasure={undefined} />
    );
    const json = JSON.stringify(toJSON());
    // disabled prop should be true in TouchableOpacity wrapping the quantity
    expect(json).toContain('"disabled":true');
  });

  it('renders quantity button as enabled when onEditMeasure is provided', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} onEditMeasure={jest.fn()} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).toContain('"disabled":false');
  });

  it('applies line-through text decoration for cancelled items', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} item={cancelledItem} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).toContain('line-through');
  });

  it('does not apply line-through for pending items', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} item={pendingItem} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).not.toContain('line-through');
  });

  it('does not apply line-through for bought items', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} item={boughtItem} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).not.toContain('line-through');
  });

  it('uses dark theme colors when isDark is true', () => {
    const { toJSON } = render(<ArticuloRow {...defaultProps} isDark={true} />);
    const json = JSON.stringify(toJSON());
    // dark theme text color
    expect(json).toContain('#EFEFEF');
  });

  it('uses light theme colors when isDark is false', () => {
    const { toJSON } = render(<ArticuloRow {...defaultProps} isDark={false} />);
    const json = JSON.stringify(toJSON());
    // light theme text color
    expect(json).toContain('#202020');
  });

  it('applies reduced opacity for cancelled items', () => {
    const { toJSON } = render(
      <ArticuloRow {...defaultProps} item={cancelledItem} />
    );
    const json = JSON.stringify(toJSON());
    expect(json).toContain('"opacity":0.6');
  });

  it('displays correct quantity with decimal values', () => {
    const itemWithDecimal = { ...pendingItem, cantidad: 1.5 };
    const { getByText } = render(
      <ArticuloRow {...defaultProps} item={itemWithDecimal} nombreMedida="Kg" />
    );
    expect(getByText('1.5 Kg')).toBeTruthy();
  });

  it('renders correctly without a measure name (empty string)', () => {
    const { getByText } = render(
      <ArticuloRow {...defaultProps} nombreMedida="" />
    );
    // Should still render the quantity with trailing space
    expect(getByText(/^2\s*$/)).toBeTruthy();
  });
});