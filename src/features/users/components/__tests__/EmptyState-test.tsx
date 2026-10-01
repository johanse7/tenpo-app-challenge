import { render, screen } from '@testing-library/react-native';

import { EmptyState } from '../EmptyState';

describe('<EmptyState />', () => {
  it('muestra el mensaje de sin resultados cuando está buscando', async () => {
    await render(<EmptyState isSearching />);

    expect(screen.getByText('Sin resultados para tu búsqueda')).toBeOnTheScreen();
    expect(screen.queryByText('Desliza para cargar más usuarios')).toBeNull();
  });

  it('muestra el mensaje de cargar más cuando no está buscando', async () => {
    await render(<EmptyState isSearching={false} />);

    expect(screen.getByText('Desliza para cargar más usuarios')).toBeOnTheScreen();
    expect(screen.queryByText('Sin resultados para tu búsqueda')).toBeNull();
  });
});
