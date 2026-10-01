export type RootStackParamList = {
  Login: undefined;
  Users: undefined;
};

declare global {
  namespace ReactNavigation {
    // Patrón estándar de React Navigation para tipado global de rutas
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
