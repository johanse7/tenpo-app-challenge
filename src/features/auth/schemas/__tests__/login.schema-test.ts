import { z } from 'zod';

import { loginSchema } from '@/features/auth/schemas/login.schema';

function fieldErrors(input: unknown) {
  const result = loginSchema.safeParse(input);
  if (result.success) {
    return null;
  }
  return z.flattenError(result.error).fieldErrors;
}

describe('loginSchema', () => {
  it('acepta un email válido y una contraseña de 8+ caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'ana@example.com',
      password: '12345678',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: 'ana@example.com', password: '12345678' });
    }
  });

  it('rechaza un email inválido con el mensaje en español', () => {
    const errors = fieldErrors({ email: 'no-es-email', password: '12345678' });

    expect(errors?.email?.[0]).toBe('Ingresa un correo electrónico válido');
  });

  it('rechaza una contraseña de menos de 8 caracteres', () => {
    const errors = fieldErrors({ email: 'ana@example.com', password: '1234567' });

    expect(errors?.password?.[0]).toBe('La contraseña debe tener al menos 8 caracteres');
  });

  it('acepta exactamente 8 caracteres de contraseña', () => {
    const result = loginSchema.safeParse({
      email: 'ana@example.com',
      password: '12345678',
    });

    expect(result.success).toBe(true);
  });

  it('reporta ambos campos cuando los dos son inválidos', () => {
    const errors = fieldErrors({ email: 'x', password: '1' });

    expect(errors?.email?.[0]).toBe('Ingresa un correo electrónico válido');
    expect(errors?.password?.[0]).toBe('La contraseña debe tener al menos 8 caracteres');
  });

  it('rechaza campos ausentes', () => {
    const result = loginSchema.safeParse({});

    expect(result.success).toBe(false);
  });
});
