import { z } from 'zod';

const userNameSchema = z.object({
  title: z.string(),
  first: z.string(),
  last: z.string(),
});

const userLocationSchema = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
});

const userDobSchema = z.object({
  date: z.string(),
  age: z.number().int().nonnegative(),
});

const userPictureSchema = z.object({
  large: z.url(),
  medium: z.url(),
  thumbnail: z.url(),
});

const userLoginSchema = z.object({
  uuid: z.string(),
});

export const userDtoSchema = z.object({
  name: userNameSchema,
  location: userLocationSchema,
  email: z.email(),
  dob: userDobSchema,
  phone: z.string(),
  picture: userPictureSchema,
  login: userLoginSchema,
});

export const usersPageResponseSchema = z.object({
  results: z.array(userDtoSchema),
  info: z.object({
    seed: z.string(),
    results: z.number().int(),
    page: z.number().int(),
    version: z.string(),
  }),
});

export type UserDto = z.infer<typeof userDtoSchema>;
export type UsersPageResponse = z.infer<typeof usersPageResponseSchema>;
