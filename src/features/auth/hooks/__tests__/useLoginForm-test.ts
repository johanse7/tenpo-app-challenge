import { act, renderHook } from '@testing-library/react-native';

import { useLoginForm } from '@/features/auth/hooks/useLoginForm';
import { useLogin } from '@/features/auth/hooks/useLogin';

jest.mock('@/features/auth/hooks/useLogin');

const mockedUseLogin = jest.mocked(useLogin);
const mutate = jest.fn();

function stubLogin(overrides: Partial<{ isPending: boolean; isError: boolean }> = {}) {
  mockedUseLogin.mockReturnValue({
    mutate,
    isPending: false,
    isError: false,
    ...overrides,
  } as unknown as ReturnType<typeof useLogin>);
}

beforeEach(() => {
  stubLogin();
});

describe('useLoginForm', () => {
  it('arranca con campos vacíos, sin errores ni pending', async () => {
    const { result } = await renderHook(() => useLoginForm());

    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isPending).toBe(false);
    expect(result.current.isServerError).toBe(false);
  });

  it('actualiza email y password', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => {
      result.current.setEmail('ana@example.com');
    });
    await act(async () => {
      result.current.setPassword('12345678');
    });

    expect(result.current.email).toBe('ana@example.com');
    expect(result.current.password).toBe('12345678');
  });

  it('no envía y pobla errores cuando el formulario es inválido', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(mutate).not.toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Ingresa un correo electrónico válido');
    expect(result.current.errors.password).toBe(
      'La contraseña debe tener al menos 8 caracteres',
    );
  });

  it('recorta el email y envía cuando el formulario es válido', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => {
      result.current.setEmail('  ana@example.com  ');
      result.current.setPassword('12345678');
    });
    await act(async () => {
      result.current.handleSubmit();
    });

    expect(mutate).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: '12345678',
    });
    expect(result.current.errors).toEqual({});
  });

  it('limpia el error de email al editarlo', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.email).toBeDefined();

    await act(async () => {
      result.current.setEmail('ana@example.com');
    });
    expect(result.current.errors.email).toBeUndefined();
    // El error de password permanece intacto
    expect(result.current.errors.password).toBeDefined();
  });

  it('limpia el error de password al editarlo', async () => {
    const { result } = await renderHook(() => useLoginForm());

    await act(async () => {
      result.current.handleSubmit();
    });
    expect(result.current.errors.password).toBeDefined();

    await act(async () => {
      result.current.setPassword('12345678');
    });
    expect(result.current.errors.password).toBeUndefined();
    expect(result.current.errors.email).toBeDefined();
  });

  it('propaga isPending e isServerError desde useLogin', async () => {
    stubLogin({ isPending: true, isError: true });

    const { result } = await renderHook(() => useLoginForm());

    expect(result.current.isPending).toBe(true);
    expect(result.current.isServerError).toBe(true);
  });
});
