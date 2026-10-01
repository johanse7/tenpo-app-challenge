import { fireEvent, render, screen } from '@testing-library/react-native';

import { ErrorState } from '../ErrorState';

const MESSAGE = 'Ocurrió un error al cargar los usuarios. Verifica tu conexión.';

describe('<ErrorState />', () => {
  it('muestra el mensaje de error', async () => {
    await render(<ErrorState onRetry={jest.fn()} />);

    expect(screen.getByText(MESSAGE)).toBeOnTheScreen();
  });

  it('invoca onRetry al presionar "Reintentar"', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
