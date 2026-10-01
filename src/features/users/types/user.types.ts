export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  age: number;
  avatarUrl: string;
}

export interface UsersPage {
  users: User[];
  page: number;
}
