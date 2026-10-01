export interface UserName {
  title: string;
  first: string;
  last: string;
}

export interface UserLocation {
  city: string;
  state: string;
  country: string;
}

export interface UserDob {
  date: string;
  age: number;
}

export interface UserPicture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface UserLogin {
  uuid: string;
}

export interface UserDto {
  name: UserName;
  location: UserLocation;
  email: string;
  dob: UserDob;
  phone: string;
  picture: UserPicture;
  login: UserLogin;
}

export interface PageInfo {
  seed: string;
  results: number;
  page: number;
  version: string;
}

export interface UsersPageResponse {
  results: UserDto[];
  info: PageInfo;
}
