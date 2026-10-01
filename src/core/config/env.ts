export const env = {
  API_BASE_URL: 'https://randomuser.me/api/',
  USERS_SEED: 'tenpo',
  USERS_PAGE_SIZE: 50,
  USERS_MAX_PAGES: 50,
  USERS_INCLUDED_FIELDS: 'name,location,email,dob,phone,picture,login',
  HTTP_TIMEOUT_MS: 20_000,
  TOKEN_STORAGE_KEY: 'tenpo.session.token',
  USER_STORAGE_KEY: 'tenpo.session.user',
  SEARCH_DEBOUNCE_MS: 300,
} as const;
