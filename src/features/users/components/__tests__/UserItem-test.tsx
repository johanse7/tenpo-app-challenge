import { render, screen } from '@testing-library/react-native';

import { UserItem } from '../UserItem';

import { makeUser } from '@/test/factories/user.factory';

describe('<UserItem />', () => {
  it('renderiza nombre, email y ubicación con edad', async () => {
    const user = makeUser({
      fullName: 'Ana Rojas',
      email: 'ana.rojas@example.com',
      city: 'Valparaíso',
      country: 'Chile',
      age: 34,
    });

    await render(<UserItem user={user} />);

    expect(screen.getByText('Ana Rojas')).toBeOnTheScreen();
    expect(screen.getByText('ana.rojas@example.com')).toBeOnTheScreen();
    expect(screen.getByText('Valparaíso, Chile · 34 años')).toBeOnTheScreen();
  });

  it('expone el avatar con texto alternativo descriptivo y su uri', async () => {
    const user = makeUser({
      fullName: 'Ana Rojas',
      avatarUrl: 'https://cdn/thumb.jpg',
    });

    await render(<UserItem user={user} />);

    const avatar = screen.getByLabelText('Foto de Ana Rojas');

    expect(avatar).toBeOnTheScreen();
    expect(avatar.props.source).toEqual({ uri: 'https://cdn/thumb.jpg' });
  });
});
