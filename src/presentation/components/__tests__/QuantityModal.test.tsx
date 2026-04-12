import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { QuantityModal } from '../QuantityModal';
import { Medida } from '../../../domain';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockTheme = {
  surface: '#1C1C24',
  background: '#13131A',
  primary: '#474358',
  text: '#EFEFEF',
  textSecondary: '#A0A0A0',
  border: '#2A2A35',
};

const mockMedidas: Medida[] = [
  { id: 'm1', nombre: 'Units' },
  { id: 'm2', nombre: 'Kg' },
  { id: 'm3', nombre: 'Liters' },
];

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
  itemName: 'Apples',
  initialQuantity: '2',
  initialMedidaId: 'm1',
  medidasCatalog: mockMedidas,
  theme: mockTheme,
};

describe('QuantityModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing when visible', () => {
    const { toJSON } = render(<QuantityModal {...defaultProps} />);
    expect(toJSON()).not.toBeNull();
  });

  it('does not render content when visible is false', () => {
    const { queryByText } = render(<QuantityModal {...defaultProps} visible={false} />);
    expect(queryByText('Apples')).toBeNull();
  });

  it('displays the item name as the modal title', () => {
    const { getByText } = render(<QuantityModal {...defaultProps} />);
    expect(getByText('Apples')).toBeTruthy();
  });

  it('displays all measure options from medidasCatalog', () => {
    const { getByText } = render(<QuantityModal {...defaultProps} />);
    expect(getByText('Units')).toBeTruthy();
    expect(getByText('Kg')).toBeTruthy();
    expect(getByText('Liters')).toBeTruthy();
  });

  it('displays the initial quantity in the input', () => {
    const { getByDisplayValue } = render(<QuantityModal {...defaultProps} initialQuantity="5" />);
    expect(getByDisplayValue('5')).toBeTruthy();
  });

  it('calls onClose when cancel button is pressed', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(<QuantityModal {...defaultProps} onClose={onCloseMock} />);
    fireEvent.press(getByText('cancel'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with correct quantity and medida when save button is pressed', () => {
    const onSaveMock = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <QuantityModal {...defaultProps} onSave={onSaveMock} initialQuantity="3" initialMedidaId="m2" />
    );
    fireEvent.changeText(getByDisplayValue('3'), '7');
    fireEvent.press(getByText('save'));
    expect(onSaveMock).toHaveBeenCalledWith(7, 'm2');
  });

  it('defaults to 1 when quantity input is empty on save', () => {
    const onSaveMock = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <QuantityModal {...defaultProps} onSave={onSaveMock} initialQuantity="1" />
    );
    fireEvent.changeText(getByDisplayValue('1'), '');
    fireEvent.press(getByText('save'));
    expect(onSaveMock).toHaveBeenCalledWith(1, 'm1');
  });

  it('calls onSave with non-numeric quantity defaulting to 1', () => {
    const onSaveMock = jest.fn();
    const { getByText, getByDisplayValue } = render(
      <QuantityModal {...defaultProps} onSave={onSaveMock} initialQuantity="2" />
    );
    fireEvent.changeText(getByDisplayValue('2'), 'abc');
    fireEvent.press(getByText('save'));
    expect(onSaveMock).toHaveBeenCalledWith(1, 'm1');
  });

  it('selects a measure chip when pressed', () => {
    const onSaveMock = jest.fn();
    const { getByText } = render(
      <QuantityModal {...defaultProps} onSave={onSaveMock} initialMedidaId="m1" />
    );
    // Select Kg (m2)
    fireEvent.press(getByText('Kg'));
    fireEvent.press(getByText('save'));
    expect(onSaveMock).toHaveBeenCalledWith(2, 'm2');
  });

  it('defaults medida to first catalog item when no initialMedidaId is provided', () => {
    const onSaveMock = jest.fn();
    const { getByText } = render(
      <QuantityModal {...defaultProps} onSave={onSaveMock} initialMedidaId={undefined} />
    );
    fireEvent.press(getByText('save'));
    expect(onSaveMock).toHaveBeenCalledWith(2, 'm1');
  });

  it('handles empty medidasCatalog without crashing', () => {
    const { toJSON } = render(
      <QuantityModal {...defaultProps} medidasCatalog={[]} initialMedidaId={undefined} />
    );
    expect(toJSON()).not.toBeNull();
  });

  it('resets local state when visible changes from false to true', () => {
    const { rerender, getByDisplayValue } = render(
      <QuantityModal {...defaultProps} visible={false} initialQuantity="3" />
    );
    rerender(<QuantityModal {...defaultProps} visible={true} initialQuantity="7" />);
    expect(getByDisplayValue('7')).toBeTruthy();
  });

  it('applies theme colors to the modal content', () => {
    const { toJSON } = render(<QuantityModal {...defaultProps} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain(mockTheme.surface);
    expect(json).toContain(mockTheme.text);
  });
});