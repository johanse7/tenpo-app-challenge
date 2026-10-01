import { mapUserDtoToUser } from '../user.mapper';

import { makeUserDto } from '@/test/factories/user.factory';

describe('mapUserDtoToUser', () => {
  it('mapea todos los campos del DTO al modelo de dominio', () => {
    const dto = makeUserDto({
      login: { uuid: 'uuid-123' },
      name: { title: 'Ms', first: 'Ana', last: 'Rojas' },
      email: 'ana.rojas@example.com',
      phone: '(56) 9 8765 4321',
      location: { city: 'Valparaíso', state: 'Valparaíso', country: 'Chile' },
      dob: { date: '1991-01-01T00:00:00.000Z', age: 34 },
      picture: {
        large: 'https://cdn/large.jpg',
        medium: 'https://cdn/medium.jpg',
        thumbnail: 'https://cdn/thumb.jpg',
      },
    });

    expect(mapUserDtoToUser(dto)).toEqual({
      id: 'uuid-123',
      fullName: 'Ana Rojas',
      email: 'ana.rojas@example.com',
      phone: '(56) 9 8765 4321',
      city: 'Valparaíso',
      country: 'Chile',
      age: 34,
      avatarUrl: 'https://cdn/thumb.jpg',
    });
  });

  it('concatena nombre y apellido con un solo espacio', () => {
    const dto = makeUserDto({ name: { first: 'Juan', last: 'de la Cruz' } });

    expect(mapUserDtoToUser(dto).fullName).toBe('Juan de la Cruz');
  });

  it('usa el thumbnail (y no large ni medium) como avatar', () => {
    const dto = makeUserDto({
      picture: {
        large: 'https://cdn/large.jpg',
        medium: 'https://cdn/medium.jpg',
        thumbnail: 'https://cdn/thumb.jpg',
      },
    });

    expect(mapUserDtoToUser(dto).avatarUrl).toBe('https://cdn/thumb.jpg');
  });

  it('usa el uuid de login como id estable', () => {
    const dto = makeUserDto({ login: { uuid: 'otro-uuid' } });

    expect(mapUserDtoToUser(dto).id).toBe('otro-uuid');
  });

  it('descarta los campos del DTO que no pertenecen al dominio', () => {
    const dto = makeUserDto({
      name: { title: 'Mr', first: 'Juan', last: 'Pérez' },
      location: { city: 'Santiago', state: 'RM', country: 'Chile' },
      dob: { date: '1990-04-12T05:32:11.204Z', age: 35 },
    });

    const user = mapUserDtoToUser(dto) as unknown as Record<string, unknown>;

    expect(Object.keys(user).sort()).toEqual([
      'age',
      'avatarUrl',
      'city',
      'country',
      'email',
      'fullName',
      'id',
      'phone',
    ]);
    expect(user).not.toHaveProperty('title');
    expect(user).not.toHaveProperty('state');
    expect(user).not.toHaveProperty('date');
  });

  it('no muta el DTO recibido', () => {
    const dto = makeUserDto();
    const snapshot = structuredClone(dto);

    mapUserDtoToUser(dto);

    expect(dto).toEqual(snapshot);
  });
});
