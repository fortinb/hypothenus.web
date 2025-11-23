import { fallbackLanguage, supportedLanguages } from '@/app/i18n/i18n';
import moment from 'moment';
import { z } from 'zod';
import { BaseEntity } from './baseEntity';
import { Coach, CoachSchema } from './coach';
import { LanguageEnum } from './language';
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from './localizedString';


export interface Course extends BaseEntity {
  id?: any;
  brandId: string;
  gymId: string;
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  coachs: Coach[];
  startDate: Date; 
  endDate?: any; //Date | undefined | null
  isActive: boolean;
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
    startDate: moment().toDate(),
    endDate: null,
    isActive: true,
    messages: undefined,
    createdBy: undefined,
    modifiedBy: undefined
  };

  supportedLanguages.forEach(l => {
    newCourse.name.push(newLocalizedString(l as LanguageEnum));
    newCourse.description.push(newLocalizedString(l as LanguageEnum));
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
  brandId: z.string().min(1),
  gymId: z.string().min(1),
  code: z.string().min(1, {message: "course.validation.codeRequired"}),
  name: z.array(LocalizedStringSchema(true, "course.validation.nameRequired")).min(1),
  description: z.array(LocalizedStringSchema(false,"")).min(1),
  startDate: z.date().min(moment().add(-1, "days").toDate(), {message: "course.validation.startDateRequired"}).optional().nullable()
    .refine((startDate) => startDate !== null && startDate !== undefined, {
      message: "course.validation.startDateRequired"
    }),
  endDate: z.date().min(moment().add(-1, "days").toDate()).optional().nullable(), 
  coachs: z.array(CoachSchema).min(0)
}).refine((course) => !course.endDate || (moment(course.endDate).format("YYYMMDD") >= moment(course.startDate).format("YYYMMDD")), {
  message: "course.validation.endDateGreaterThanStartDate",
  path: ["endDate"], // path of error
 });

/*rules={{
  validate: value =>
      value == null || "course.validation.endDateGreaterThanStartDate"
}}
  */

