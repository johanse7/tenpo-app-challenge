import { render, screen } from '@testing-library/react-native';

import { ListFooter } from '../ListFooter';

describe('<ListFooter />', () => {
  it('muestra el spinner mientras carga', async () => {
    await render(<ListFooter isLoading hasReachedEnd={false} totalCount={10} />);

    // El Spinner de gluestack expone aria-label="loading"
    expect(screen.getByLabelText('loading')).toBeOnTheScreen();
    expect(screen.queryByText(/Fin de la lista/)).toBeNull();
  });

  it('muestra el fin de la lista con el conteo total', async () => {
    await render(<ListFooter isLoading={false} hasReachedEnd totalCount={42} />);

    expect(screen.getByText('Fin de la lista · 42 usuarios')).toBeOnTheScreen();
    expect(screen.queryByLabelText('loading')).toBeNull();
  });

  it('no renderiza nada si no carga y no ha llegado al fin', async () => {
    const { toJSON } = await render(
      <ListFooter isLoading={false} hasReachedEnd={false} totalCount={0} />,
    );

    expect(toJSON()).toBeNull();
  });
});
