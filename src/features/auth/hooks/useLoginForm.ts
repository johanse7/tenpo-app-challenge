import { useCallback, useState } from 'react';
import { z } from 'zod';

import { loginSchema } from '../schemas/login.schema';
import { useLogin } from './useLogin';

import type { LoginFieldErrors } from '../schemas/login.schema';

interface LoginFormState {
  email: string;
  password: string;
  errors: LoginFieldErrors;
  isPending: boolean;
  isServerError: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSubmit: () => void;
}

/**
 * Lógica del formulario: validación zod + disparo del login.
 * El componente LoginForm queda 100% presentacional.
 */
export function useLoginForm(): LoginFormState {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const { mutate, isPending, isError } = useLogin();

  const handleSubmit = useCallback(() => {
    const result = loginSchema.safeParse({ email: email.trim(), password });

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    mutate(result.data);
  }, [email, password, mutate]);

  const handleChangeEmail = useCallback((nextEmail: string) => {
    setEmail(nextEmail);
    setErrors((prev) => ({ ...prev, email: undefined }));
  }, []);

  const handleChangePassword = useCallback((nextPassword: string) => {
    setPassword(nextPassword);
    setErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  return {
    email,
    password,
    errors,
    isPending,
    isServerError: isError,
    setEmail: handleChangeEmail,
    setPassword: handleChangePassword,
    handleSubmit,
  };
}
