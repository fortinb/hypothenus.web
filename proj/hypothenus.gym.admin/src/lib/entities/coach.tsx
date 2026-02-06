import { z } from 'zod';
import { newPerson, parsePerson, Person, PersonSchema } from './person';
import { BaseEntity } from './baseEntity';
import { LanguageEnum } from './language';

export interface Coach extends BaseEntity {
  uuid?: any;
  brandUuid?: any;
  gymUuid?: any;
  person: Person;
  isActive: boolean;
}

export interface CoachReference extends BaseEntity {
  uuid?: any;
  brandUuid: string;
  gymUuid: string;
}

export const newCoach = (): Coach => {
  let newCoach: Coach = {
    uuid: null,
    brandUuid: null,
    gymUuid: null,
    person: newPerson(),
    isActive: true,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newCoach;
}

export const parseCoach = (data: any): Coach => {
  let coach: Coach = data;

  coach.person = parsePerson(data.person);

  return coach;
}

export const CoachSchema = z.object({
  person: PersonSchema
});

export const CoachReferenceSchema = z.object({
  uuid: z.any().nullable(),
  brandUuid: z.string().min(1),
  gymUuid: z.string().min(1)
});