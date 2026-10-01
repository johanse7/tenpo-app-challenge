# Tenpo — Challenge Mobile

App móvil (Expo / React Native) que implementa un flujo de **login** y un **listado paginado de clientes** consumidos desde [randomuser.me](https://randomuser.me/api/), con sesión persistida, búsqueda con debounce y virtualización para datasets grandes.

Puedes ingresar con cualquier Email y una contraseña de 8 caracteres como minimo.

- **Stack:** Expo SDK 54 · React Native 0.81 · Expo Router · TypeScript · TanStack Query · Zustand · Axios · Zod · NativeWind + Gluestack UI · FlashList
- **Repositorio:** `github.com/johanse7/tenpo-app-challenge`

---

## Ver el resultado de la app

### Opción 1 — Preview en Expo Go (QR de EAS Update)

Escanea este QR con **Expo Go** (o ábrelo como deep link) para cargar el update publicado en el canal `preview`:

![QR preview update de EAS](docs/assets/qr-preview-update.png)

- **Deep link:** `exp://u.expo.dev/f1ca14a4-3285-4340-8de1-01a3f1582e27/group/7d1c2e9b-9c29-4dd7-9b2d-f26bd59b9861`
- **Página del preview (EAS):** [expo.dev/preview/update…](https://expo.dev/preview/update?message=Republish+%22Versi%C3%B3n+para+revisi%C3%B3n+t%C3%A9cnica%22+-+group%3A+5f9557ca-10e9-44ea-b32f-1e10c632b618&updateRuntimeVersion=1.0.0&createdAt=2026-10-01T16%3A59%3A19.793Z&slug=exp&projectId=f1ca14a4-3285-4340-8de1-01a3f1582e27&group=7d1c2e9b-9c29-4dd7-9b2d-f26bd59b9861)

> Requiere Expo Go con runtime compatible con SDK 54 (runtime version `1.0.0`).

### Opción 2 — APK instalable (Android)

Build `preview` (distribución interna) generada con EAS Build:

- **APK directo:** [Tenpo-1.0.0.apk](https://expo.dev/artifacts/eas/urD_7KtIEqLqMc0NlL9W9iHS8eaceciV8V3n5EfM1Xw.apk)
- **Página del build en EAS:** [expo.dev/accounts/johanse777/projects/Tenpo/builds/9df6aca4-7856-4708-bba4-88ed8b31cd49](https://expo.dev/accounts/johanse777/projects/Tenpo/builds/9df6aca4-7856-4708-bba4-88ed8b31cd49)

Descarga el APK en el dispositivo y permite la instalación de fuentes desconocidas.

---

## Levantar el proyecto

### Requisitos

- Node.js 20+ (o Bun)
- Cuenta de Expo (`npx expo login`) solo si quieres publicar updates o builds; para desarrollo local no es necesaria
- Expo Go en el dispositivo físico (opcional, para probar en celular)

### Pasos

```bash
# 1. Clonar el repositorio
git clone git@github.com:johanse7/tenpo-app-challenge.git
cd tenpo-app-challenge

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npx expo start
```

Luego presiona:

- `i` → simulador iOS
- `a` → emulador Android
- Escanea el QR de la terminal con **Expo Go** para dispositivo físico

### Scripts útiles

| Comando             | Descripción                              |
| ------------------- | ---------------------------------------- |
| `npm start`         | Levanta el dev server de Expo            |
| `npm run android`   | Arranca directo en emulador Android      |
| `npm run ios`       | Arranca directo en simulador iOS         |
| `npm run web`       | Arranca la versión web                   |
| `npm run lint`      | ESLint                                   |
| `npm run typecheck` | TypeScript sin emitir (`tsc --noEmit`)   |
| `npm test`          | Suite de tests (Jest + Testing Library)  |

---

## Usuario demo

El backend de autenticación es **mockeado** (`src/features/auth/services/authService.ts`): no hay credenciales fijas.

Puedes entrar con **cualquier email válido y una contraseña de al menos 8 caracteres**, por ejemplo:

| Campo    | Valor            |
| -------- | ---------------- |
| Email    | `demo@tenpo.cl`  |
| Password | `tenpo1234`      |

La validación de formato se hace con Zod en `src/features/auth/schemas/login.schema.ts`.

---

## Decisiones técnicas relevantes

- **Expo SDK 54 + Expo Router (file-based routing):** navegación declarativa con grupos de rutas `(auth)` y `(app)` que actúan como áreas protegidas; el root layout decide qué stack montar según el estado de sesión.
- **Arquitectura por features:** `src/features/{auth,users}` agrupa screens, hooks, services, schemas y tests de cada dominio; `src/core/{api,storage,query,config}` concentra infraestructura reutilizable (cliente HTTP, SecureStore, QueryClient, env).
- **TanStack Query (`useInfiniteQuery`)** para el estado servidor de la lista: cacheo por páginas, refetch, reintentos y paginación infinita sin estado manual.
- **Zustand + `persist`** para el estado de sesión en cliente, hidratado desde `expo-secure-store`.
- **Axios con interceptores:** inyecta el token en cada request y centraliza el manejo de `401` (cierre de sesión global).
- **Zod** para validación de formularios y **mapper** dedicado (`user.mapper.ts`) que desacopla el DTO de randomuser.me del modelo de dominio.
- **FlashList** en lugar de `FlatList` por virtualización eficiente en datasets de miles de registros.
- **NativeWind + Gluestack UI** para estilos utilitarios y componentes accesibles con soporte light/dark y web.
- **Testing:** Jest + React Native Testing Library con factories y mocks de storage; cobertura de hooks, services, schemas y componentes.
- **Config centralizada** en `src/core/config/env.ts` (tamaños de página, seeds, timeouts, claves de storage) para evitar magic numbers dispersos.

---

## Manejo de sesión / autenticación

1. **Login mock con latencia simulada** (`authService.login`): valida el DTO con Zod y emite un token ficticio.
2. **Separación token vs. perfil:**
   - El **token** se guarda en `expo-secure-store` (Keychain/Keystore), nunca en el store de Zustand ni en AsyncStorage (`authService.persistToken`).
   - El **usuario** se persiste con `zustand/persist` para pintar el saludo sin esperar I/O.
3. **Restauración de sesión en frío** (`useSessionRestore`): al arrancar, el splash se mantiene hasta (a) hidratar el store y (b) confirmar que el token sigue existiendo en SecureStore. Un usuario persistido sin token **no** se considera autenticado (evita entrar al área privada y rebotar en el primer 401).
4. **Router como guard:** `src/app/_layout.tsx` monta `(auth)` o `(app)` según `selectIsAuthenticated`; mientras se resuelve la sesión se muestra `SplashLoader`.
5. **Interceptor de request** adjunta `Authorization: Bearer <token>` desde SecureStore; el **interceptor de response** detecta `401` y notifica al handler global que cierra sesión y redirige al login (`unauthorizedHandler`).
6. **Logout:** limpia token en SecureStore y resetea el store, volviendo al stack `(auth)`.

---

## Estrategia para renderizar la lista

- **Paginación infinita con `useInfiniteQuery`:** páginas de 50 registros (`USERS_PAGE_SIZE`) con seed fijo `tenpo` y campos recortados (`USERS_INCLUDED_FIELDS`) para payloads livianos; tope de 50 páginas (~2500 registros). `getNextPageParam` corta al llegar al máximo.
- **Aplanado memoizado:** `pages.flatMap(...)` se memoiza con `useMemo` para conservar identidad referencial y no invalidar la virtualización en cada render.
- **Virtualización con FlashList:** recicla views nativas; `onEndReachedThreshold={0.5}` pide la siguiente página antes de llegar al final.
- **Items memoizados:** `UserItem` envuelto en `React.memo` y todas las callbacks (`renderItem`, `keyExtractor`, `onEndReached`) con `useCallback`/`useMemo` para que el memo surta efecto.
- **Búsqueda client-side con debounce (300 ms)** sobre el dataset ya cacheado (`useUserSearch`), porque randomuser.me no expone filtro por texto; el footer indica estado de carga y total acumulado.
- **Estados de UI completos:** loading (spinner), error con retry (`ErrorState`), vacío con/sin búsqueda (`EmptyState`) y pull-to-refresh (`refetch`).

---

## Posibles mejoras / siguientes pasos

- **Auth real:** conectar a un backend propio con refresh token, expiración y revocación; hoy el token es mock.
- **Búsqueda server-side o indexada** para filtrar sobre el total y no solo sobre las páginas cargadas.
- **Cache offline persistente** de páginas (MMKV como persister de QueryClient) para arranque sin red.
- **E2E tests** con Maestro o Detox sobre el build `preview`.
- **CI:** correr `lint`, `typecheck` y `test` en cada PR y publicar updates automáticos por branch con EAS.
