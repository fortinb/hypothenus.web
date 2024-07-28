import { z } from 'zod';
import { newPerson, Person, PersonSchema } from './person';
import { BaseEntity } from './baseEntity';

export interface Coach extends BaseEntity {
  id?: any;
  gymId: string;
  person: Person;
  active: boolean;
}

export const newCoach = (): Coach => {
  let newCoach: Coach = {
    id: null,
    gymId: "",
    person: newPerson(),
    active: false,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newCoach;
}

export const CoachSchema = z.object({
  id: z.any().nullable(),
  gymId: z.string().min(1),
  person: PersonSchema
});