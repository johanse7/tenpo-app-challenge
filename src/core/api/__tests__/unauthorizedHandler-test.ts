import {
  notifyUnauthorized,
  setUnauthorizedHandler,
} from '@/core/api/unauthorizedHandler';

describe('unauthorizedHandler', () => {
  afterEach(() => {
    setUnauthorizedHandler(null);
  });

  it('notify no lanza si no hay handler registrado', () => {
    expect(() => notifyUnauthorized()).not.toThrow();
  });

  it('invoca el handler registrado al notificar', () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);

    notifyUnauthorized();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('puede desregistrarse con null', () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    setUnauthorizedHandler(null);

    notifyUnauthorized();

    expect(handler).not.toHaveBeenCalled();
  });

  it('el último handler registrado gana', () => {
    const first = jest.fn();
    const second = jest.fn();
    setUnauthorizedHandler(first);
    setUnauthorizedHandler(second);

    notifyUnauthorized();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
