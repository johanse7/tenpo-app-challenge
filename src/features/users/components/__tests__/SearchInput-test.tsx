import { fireEvent, render, screen } from '@testing-library/react-native';

import { SearchInput } from '../SearchInput';

const PLACEHOLDER = 'Buscar por nombre o email';

describe('<SearchInput />', () => {
  it('renderiza el placeholder de búsqueda', async () => {
    await render(<SearchInput value="" onChangeText={jest.fn()} />);

    expect(screen.getByPlaceholderText(PLACEHOLDER)).toBeOnTheScreen();
  });

  it('notifica onChangeText al escribir', async () => {
    const onChangeText = jest.fn();
    await render(<SearchInput value="" onChangeText={onChangeText} />);

    await fireEvent.changeText(screen.getByPlaceholderText(PLACEHOLDER), 'ana');

    expect(onChangeText).toHaveBeenCalledWith('ana');
  });

  it('refleja el value controlado y desactiva autocapitalización/corrección', async () => {
    await render(<SearchInput value="hola" onChangeText={jest.fn()} />);

    const input = screen.getByPlaceholderText(PLACEHOLDER);

    expect(input.props.value).toBe('hola');
    expect(input.props.autoCapitalize).toBe('none');
    expect(input.props.autoCorrect).toBe(false);
    expect(input.props.returnKeyType).toBe('search');
  });
});
