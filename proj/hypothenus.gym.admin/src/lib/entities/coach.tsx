import { z } from 'zod';
import { newPerson, parsePerson, Person, PersonSchema } from './contact/person';
import { BaseEntity } from './entity/base-entity';

export interface Coach extends BaseEntity {
  uuid?: any;
  brandUuid?: any;
  person: Person;
  active: boolean;
}

export interface CoachReference extends BaseEntity {
  uuid?: any;
  brandUuid: string;
}

export const newCoach = (): Coach => {
  let newCoach: Coach = {
    uuid: null,
    brandUuid: null,
    person: newPerson(),
    active: true,
    messages:  [],
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

export const serializeCoach = (coach: Coach): any => {
  return { ...coach };
}

export const CoachSchema = z.object({
  person: PersonSchema
});

export const CoachReferenceSchema = z.object({
  uuid: z.any().nullable(),
  brandUuid: z.string().min(1)
});