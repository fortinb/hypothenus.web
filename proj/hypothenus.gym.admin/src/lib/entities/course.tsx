import moment from 'moment';
import { z } from 'zod';
import { BaseEntity } from './baseEntity';
import { Coach, CoachReferenceSchema } from './coach';
import { LanguageEnum } from './language';
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from './localizedString';
import { routing } from '@/i18n/routing';


export interface Course extends BaseEntity {
  id?: any;
  brandId: string;
  gymId: string;
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  coachs: Coach[];
  startDate: string;
  endDate?: any; 
  isActive: boolean;
}

export const parseCourse = (data: any): Course => {
  let course: Course = data;

  if (data.startDate) {
    course.startDate = moment(data.startDate).toDate().toISOString();
  }
  if (data.endDate) {
    course.endDate = moment(data.endDate).toDate().toISOString();
  }

  return course;

}

export const newCourse = (): Course => {
  let newCourse: Course = {
    id: null,
    brandId: "",
    gymId: "",
    code: "",
    name: [],
    description: [],
    coachs: [],
    startDate: moment().toDate().toISOString(),
    endDate: undefined,
    isActive: true,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined,
  };

  routing.locales.forEach(l => {
    newCourse.name.push(newLocalizedString(l as LanguageEnum));
    newCourse.description.push(newLocalizedString(l as LanguageEnum));
  });

  return newCourse;
}

export function getCourseName(course: Course, language?: LanguageEnum): string {

  let name = course.name?.find(c => c.language === language);
  if (!name) {
    name = course.name?.find(c => c.language == routing.defaultLocale as LanguageEnum);
  }

  return name?.text ?? "";
}

export const CourseSchema = z.object({
  id: z.any().nullable(),
  brandId: z.string().min(1),
  gymId: z.string().min(1),
  code: z.string().min(1, { message: "course.validation.codeRequired" }),
  name: z.array(LocalizedStringSchema(true, "course.validation.nameRequired")).min(1),
  description: z.array(LocalizedStringSchema(false, "")).min(1),
  startDate: z.string().min(1, { message: "course.validation.startDateRequired" }),
  endDate: z.any().nullable(),
  coachs: z.array(CoachReferenceSchema).min(0).nullable(),
}).refine((course) => !course.endDate || (moment(course.endDate).format("YYYMMDD") >= moment(course.startDate).format("YYYMMDD")), {
  message: "course.validation.endDateGreaterThanStartDate",
  path: ["endDate"], // path of error
});

