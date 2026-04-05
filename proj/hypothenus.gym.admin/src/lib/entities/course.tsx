import moment from 'moment';
import { z } from 'zod';
import { BaseEntity } from './base-entity';
import { LanguageEnum } from './enum/language-enum';
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from './localized-string';
import { localesConfig } from "@/i18n/locales-client";

export interface Course extends BaseEntity {
  uuid?: any;
  brandUuid?: any;
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  startDate?: any;
  endDate?: any; 
  active: boolean;
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

export const serializeCourse = (course: Course): any => {
  return { ...course };
}

export const newCourse = (): Course => {
  let newCourse: Course = {
    uuid: null,
    brandUuid: null,
    code: "",
    name: [],
    description: [],
    startDate: moment().format("YYYY-MM-DD"),
    endDate: undefined,
    active: true,
    messages:  [],
    createdBy: undefined,
    modifiedBy: undefined,
  };

  localesConfig.locales.forEach(l => {
    newCourse.name.push(newLocalizedString(l as LanguageEnum));
    newCourse.description.push(newLocalizedString(l as LanguageEnum));
  });

  return newCourse;
}

export function getCourseName(course: Course, language?: LanguageEnum): string {

  let name = course.name?.find(c => c.language === language);
  if (!name) {
    name = course.name?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
  }

  return name?.text ?? "";
}

export const CourseSchema = z.object({
  code: z.string().min(1, { message: "course.validation.codeRequired" }),
  name: z.array(LocalizedStringSchema(true, "course.validation.nameRequired")).min(2),
  description: z.array(LocalizedStringSchema(true, "course.validation.descriptionRequired")).min(2),
  startDate: z.string().nullable().refine((date) => !!date, { message: "course.validation.startDateRequired" }),
  endDate: z.string().nullable().optional(),
}).refine((course) => !course.endDate || !course.startDate || (moment(course.endDate).format("YYYYMMDD") >= moment(course.startDate).format("YYYYMMDD")), {
  message: "course.validation.endDateGreaterThanStartDate",
  path: ["endDate"], // path of error
}).refine((course) => !course.endDate || !course.startDate || (moment(course.endDate).format("YYYYMMDD") > moment().format("YYYYMMDD")), {
  message: "course.validation.endDateGreaterThanToday",
  path: ["endDate"], // path of error;
});

export const CourseReferenceSchema = z.object({
  uuid: z.any().nullable(),
  brandUuid: z.string().min(1)
});
