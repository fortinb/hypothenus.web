import { z } from 'zod';
import { BaseEntity } from './baseEntity';
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from './localizedString';
import { LanguageEnum } from './language';
import { fallbackLanguage, supportedLanguages } from '@/app/i18n/i18n';


export interface Course extends BaseEntity {
  id?: any;
  gymId: string;
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  isActive: boolean;
}

export const newCourse = (): Course => {
  let newCourse: Course = {
    id: null,
    gymId: "",
    code: "",
    name: [],
    description: [],
    isActive: false,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  supportedLanguages.forEach(l => {
    newCourse.name.push(newLocalizedString(l));
    newCourse.description.push(newLocalizedString(l));
  });
 
  return newCourse;
}

export function getCourseName(course: Course, language?: LanguageEnum): string {
  
  let name = course.name?.find(c => c.language === language );
  if (!name) {
    name = course.name?.find(c => c.language == fallbackLanguage as LanguageEnum);
  }

  return name?.text ?? "";
}

export const CourseSchema = z.object({
  id: z.any().nullable(),
  gymId: z.string().min(1),
  code: z.string().min(1, {message: "course.validation.codeRequired"}),
  name: z.array(LocalizedStringSchema).min(2),
  description: z.array(LocalizedStringSchema).min(2),
});