import React from 'react';
import { render } from '@testing-library/react-native';
import { ListProgressBar } from '../ListProgressBar';
import { Colors } from '../../constants/theme';

const mockTheme = {
  primary: '#474358',
  background: '#13131A',
  surface: '#1C1C24',
  text: '#EFEFEF',
  textSecondary: '#A0A0A0',
  border: '#2A2A35',
};

describe('ListProgressBar', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<ListProgressBar progreso={50} theme={mockTheme} />);
    expect(toJSON()).not.toBeNull();
  });

  it('applies the theme primary color as the progress bar background', () => {
    const { toJSON } = render(<ListProgressBar progreso={50} theme={mockTheme} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain(mockTheme.primary);
  });

  it('applies the success color to the progress fill', () => {
    const { toJSON } = render(<ListProgressBar progreso={75} theme={mockTheme} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain(Colors.dark.success);
  });

  it('renders fill with 0% width when progreso is 0', () => {
    const { toJSON } = render(<ListProgressBar progreso={0} theme={mockTheme} />);
    const json = toJSON() as any;
    // The inner fill View should have width "0%"
    const outerWrapper = json.children[0];
    const fill = outerWrapper.children[0];
    expect(fill.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: '0%' }),
      ])
    );
  });

  it('renders fill with 100% width when progreso is 100', () => {
    const { toJSON } = render(<ListProgressBar progreso={100} theme={mockTheme} />);
    const json = toJSON() as any;
    const outerWrapper = json.children[0];
    const fill = outerWrapper.children[0];
    expect(fill.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: '100%' }),
      ])
    );
  });

  it('renders fill with the correct percentage width for arbitrary values', () => {
    const { toJSON } = render(<ListProgressBar progreso={37} theme={mockTheme} />);
    const json = toJSON() as any;
    const outerWrapper = json.children[0];
    const fill = outerWrapper.children[0];
    expect(fill.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: '37%' }),
      ])
    );
  });

  it('renders with a different theme primary color', () => {
    const lightTheme = { ...mockTheme, primary: '#6A6385' };
    const { toJSON } = render(<ListProgressBar progreso={50} theme={lightTheme} />);
    const json = JSON.stringify(toJSON());
    expect(json).toContain('#6A6385');
  });
});