import { fireEvent, render, screen } from '@testing-library/react-native';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

jest.mock('@/features/auth/hooks/useLoginForm');

const mockedUseLoginForm = jest.mocked(useLoginForm);

type FormState = ReturnType<typeof useLoginForm>;

function stubForm(overrides: Partial<FormState> = {}): FormState {
  const state = {
    email: '',
    password: '',
    errors: {},
    isPending: false,
    isServerError: false,
    setEmail: jest.fn(),
    setPassword: jest.fn(),
    handleSubmit: jest.fn(),
    ...overrides,
  } as FormState;

  mockedUseLoginForm.mockReturnValue(state);

  return state;
}

describe('<LoginForm />', () => {
  it('renderiza encabezado, campos y botón de envío', async () => {
    stubForm();

    await render(<LoginForm />);

    expect(screen.getByText('Bienvenido')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Email')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Contraseña')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeOnTheScreen();
  });

  it('envía el formulario al presionar "Iniciar sesión"', async () => {
    const state = stubForm();

    await render(<LoginForm />);
    await fireEvent.press(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(state.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('alterna la visibilidad de la contraseña', async () => {
    stubForm();

    await render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('Contraseña');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // El slot del toggle queda tras `accessibilityElementsHidden`, así que la
    // query debe incluir elementos ocultos para la accesibilidad.
    await fireEvent.press(
      screen.getByLabelText('Mostrar contraseña', { includeHiddenElements: true }),
    );

    expect(
      screen.getByLabelText('Ocultar contraseña', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('Contraseña').props.secureTextEntry).toBe(false);
  });

  it('muestra los errores de campo provenientes del hook', async () => {
    stubForm({
      errors: {
        email: 'Ingresa un correo electrónico válido',
        password: 'La contraseña debe tener al menos 8 caracteres',
      },
    });

    await render(<LoginForm />);

    expect(screen.getByText('Ingresa un correo electrónico válido')).toBeOnTheScreen();
    expect(
      screen.getByText('La contraseña debe tener al menos 8 caracteres'),
    ).toBeOnTheScreen();
  });

  it('muestra el banner de error de servidor', async () => {
    stubForm({ isServerError: true });

    await render(<LoginForm />);

    expect(
      screen.getByText('No pudimos iniciar sesión. Intenta nuevamente.'),
    ).toBeOnTheScreen();
  });

  it('en pending muestra "Ingresando…" y deshabilita el botón', async () => {
    stubForm({ isPending: true });

    await render(<LoginForm />);

    expect(screen.getByText('Ingresando…')).toBeOnTheScreen();

    // El toggle de contraseña está oculto a accesibilidad, así que el único
    // button accesible es el de envío.
    const submit = screen.getByRole('button');
    expect(submit).toBeDisabled();
  });
});
