import { z } from 'zod';
import { BaseEntity } from './base-entity';
import { RoleEnum } from './enum/role-enum';

export interface User extends BaseEntity {
  uuid?: any;
  firstname?: string;
  lastname?: string;
  email: string;
  roles: RoleEnum[];
  isActive: boolean;
}

export const newUser = (): User => {
  let newUser: User = {
    uuid: null,
    firstname: "",
    lastname: "",
    email: "",
    roles: [],
    isActive: true,
    messages: [],
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newUser;
}

export const parseUser = (data: any): User => {
  let user: User = data;
  return user;
}

export const serializeUser = (user: User): any => {
  return { ...user };
}

export const UserSchema = z.object({
  firstname: z.string().min(1, { message: "user.validation.firstnameRequired" }),
  lastname: z.string().min(1, { message: "user.validation.lastnameRequired" }),
  email: z.email("user.validation.emailInvalid"),
});


