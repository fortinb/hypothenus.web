import { z } from 'zod';
import { BaseEntity } from './baseEntity';

export enum RoleEnum {
  Admin = "admin",
  Manager = "manager",
  Coach = "coach",
  Member = "member"
}

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
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newUser;
}

export const parseUser = (data: any): User => {
  let user: User = data;
  return user;
}

export const UserSchema = z.object({
  firstname: z.string().min(1, { message: "user.validation.firstnameRequired" }),
  lastname: z.string().min(1, { message: "user.validation.lastnameRequired" }),
  email: z.email("user.validation.emailInvalid"),
});


