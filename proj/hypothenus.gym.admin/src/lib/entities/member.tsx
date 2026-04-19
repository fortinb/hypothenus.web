import { z } from 'zod';
import { newPerson, parsePerson, Person, PersonRegistrationSchema, PersonSchema } from './contact/person';
import { BaseEntity } from './entity/base-entity';
import { MemberTypeEnum } from './enum/member-type-enum';
import { FinancialInstrument } from './financial/financial-instrument';

export interface Member extends BaseEntity {
  uuid?: any;
  brandUuid?: any;
  password?: any;
  person: Person;
  memberType: MemberTypeEnum;
  preferredGymUuid: string;
  financialInstruments: FinancialInstrument[];
  active: boolean;
}

export const newMember = (): Member => {
  let newMember: Member = {
    uuid: null,
    brandUuid: null,
    password: null,
    person: newPerson(),
    memberType: MemberTypeEnum.regular,
    preferredGymUuid: "",
    active: true,
    financialInstruments: [],
    messages: [],
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newMember;
}

export const parseMember = (data: any): Member => {
  let member: Member = data;
  member.person = parsePerson(data.person);
  
  if (!member.financialInstruments) {
    member.financialInstruments = [];
  }

  return member;
}

export const serializeMember = (member: Member): any => {
  return { ...member };
}

export const MemberSchema = z.object({
  person: PersonSchema,
  memberType: z.enum(MemberTypeEnum),
  preferredGymUuid: z.string().min(1, { message: "member.validation.preferredGymRequired" }),
});

export const MemberRegistrationSchema = z.object({
  password: z.string().min(1, { message: "member.validation.passwordRequired" }),
  passwordConfirmation: z.string().min(1, { message: "member.validation.passwordConfirmationRequired" }),
  person: PersonRegistrationSchema,
  memberType: z.enum(MemberTypeEnum),
  preferredGymUuid: z.string().min(1, { message: "member.validation.preferredGymRequired" }),
}).refine((registration) => registration.password === registration.passwordConfirmation, {
  message: "member.validation.passwordConfirmationMismatch",
  path: ["passwordConfirmation"], // path of error
});
