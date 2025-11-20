import { z } from 'zod';
import { newPerson, Person, PersonSchema } from './person';
import { BaseEntity } from './baseEntity';

export interface Coach extends BaseEntity {
  id?: any;
  brandId: string;
  gymId: string;
  person: Person;
  isActive: boolean;
}

export const newCoach = (): Coach => {
  let newCoach: Coach = {
    id: null,
    brandId: "",
    gymId: "",
    person: newPerson(),
    isActive: false,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  return newCoach;
}

export const CoachSchema = z.object({
  id: z.any().nullable(),
  brandId: z.string().min(1),
  gymId: z.string().min(1),
  person: PersonSchema
});