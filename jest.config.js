/**
 * `preset: 'jest-expo'` ya aporta transform, resolver, haste, moduleNameMapper
 * (derivado de los `paths` de tsconfig.json) y los mocks de los módulos nativos
 * de Expo. Solo se sobrescribe lo que el preset no cubre.
 *
 * Docs: https://docs.expo.dev/develop/unit-testing/
 */

/**
 * Paquetes publicados solo como ESM que Jest debe transpilar con babel-jest.
 * Se suman a la lista que trae jest-expo (react-native, @react-native, expo,
 * @expo, @expo-google-fonts, react-navigation, @react-navigation,
 * @sentry/react-native, native-base).
 */
const esmPackages = [
  '@tanstack',
  '@gluestack-ui',
  '@legendapp',
  '@shopify',
  '@internationalized',
  '@react-aria',
  '@react-stately',
  '@formatjs',
  '@swc/helpers',
  'nativewind',
  'react-native-css-interop',
  'tailwind-variants',
  'test-renderer',
  'use-sync-external-store',
  'react-aria',
  'react-stately',
  'zustand',
  'clsx',
];

module.exports = {
  preset: 'jest-expo',

  // Amplía (no reemplaza) la lista del preset: `/node_modules/` sin anclar
  // permite que también aplique a dependencias anidadas. Los nombres van sin
  // `/` final porque son prefijos (`expo` cubre `expo-modules-core`, etc.).
  transformIgnorePatterns: [
    `/node_modules/(?!(${[
      '.pnpm',
      'react-native',
      '@react-native',
      '@react-native-community',
      'expo',
      '@expo',
      '@expo-google-fonts',
      'react-navigation',
      '@react-navigation',
      '@sentry/react-native',
      'native-base',
      ...esmPackages,
    ].join('|')}))`,
    // Evita "Reentrant plugin detected" al cargar el plugin de reanimated.
    '/node_modules/react-native-reanimated/plugin/',
  ],

  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],

  testMatch: [
    '**/__tests__/**/*-test.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  clearMocks: true,
  restoreMocks: true,

  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/src/test/mocks/styleMock.ts',
  },

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/app/**',
    '!src/components/ui/**',
    '!src/test/**',
    '!src/**/*.types.ts',
    '!src/**/types/**',
    '!src/**/*.d.ts',
  ],

  coverageReporters: ['text', 'lcov'],
};
