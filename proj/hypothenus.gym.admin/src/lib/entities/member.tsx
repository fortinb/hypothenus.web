import { z } from 'zod';
import { newPerson, parsePerson, Person, PersonSchema } from './person';
import { BaseEntity } from './baseEntity';

export enum MemberTypeEnum {
  Regular = "regular",
  Premium = "premium",
  Employee = "employee"
}

export interface Member extends BaseEntity {
  uuid?: any;
  brandUuid?: any;
  password?: any;
  person: Person;
  memberType: MemberTypeEnum;
  preferredGymUuid: string;
  isActive: boolean;
}


export const newMember = (): Member => {
  let newMember: Member = {
    uuid: null,
    brandUuid: null,
    password: null,
    person: newPerson(),
    memberType: MemberTypeEnum.Regular,
    preferredGymUuid: "",
    isActive: true,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newMember;
}

export const parseMember = (data: any): Member => {
  let member: Member = data;
  member.person = parsePerson(data.person);

  return member;
}

export const MemberSchema = z.object({
  password: z.any().nullable(),
  person: PersonSchema,
  memberType: z.enum(MemberTypeEnum),
  preferredGymUuid: z.string().min(1, { message: "member.validation.preferredGymRequired" }),
});
