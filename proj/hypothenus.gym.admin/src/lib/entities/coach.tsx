import { z } from 'zod';
import { newPerson, parsePerson, Person, PersonSchema } from './person';
import { BaseEntity } from './baseEntity';

export interface Coach extends BaseEntity {
  uuid?: any;
  brandId: string;
  gymId: string;
  person: Person;
  isActive: boolean;
}

export interface CoachReference extends BaseEntity {
  uuid?: any;
  brandId: string;
  gymId: string;
}

export const newCoach = (): Coach => {
  let newCoach: Coach = {
    uuid: null,
    brandId: "",
    gymId: "",
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
  brandId: z.string().min(1),
  gymId: z.string().min(1)
});