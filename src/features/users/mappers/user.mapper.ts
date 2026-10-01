import type { UserDto } from '../schemas/user.schema';
import type { User } from '../types/user.types';

export function mapUserDtoToUser(dto: UserDto): User {
  return {
    id: dto.login.uuid,
    fullName: `${dto.name.first} ${dto.name.last}`,
    email: dto.email,
    phone: dto.phone,
    city: dto.location.city,
    country: dto.location.country,
    age: dto.dob.age,
    avatarUrl: dto.picture.thumbnail,
  };
}
