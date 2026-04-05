import { Cost, CostSchema, parseCost, serializeCost } from "./pricing/cost";
import { z } from 'zod';
import { Course, CourseReferenceSchema } from "./course";
import { BillingFrequencyEnum } from "./enum/billing-frequency-enum";
import { MembershipPlanPeriodEnum } from "./enum/membership-plan-period-enum";
import { Gym, GymReferenceSchema } from "./gym";
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from "./localized-string";
import { BaseEntity } from "./base-entity";
import { newCurrency } from "./pricing/currency";
import { LanguageEnum } from "./enum/language-enum";
import { localesConfig } from "@/i18n/locales-client";
import moment from "moment";

export interface MembershipPlan extends BaseEntity {
    uuid?: any;
    brandUuid?: any;
    name: LocalizedString[];
    title: LocalizedString[];
    description: LocalizedString[];
    detail: LocalizedString[];
    numberOfClasses: number;
    period: MembershipPlanPeriodEnum;
    billingFrequency: BillingFrequencyEnum;
    cost: Cost;
    durationInMonths: number;
    guestPrivilege: boolean;
    promotional: boolean;
    giftCard: boolean;
    includedCourses: Course[];
    includedGyms: Gym[];
    startDate?: any;
    endDate?: any;
    active: boolean;
    activatedOn?: string;
    deactivatedOn?: string;
}

export const parseMembershipPlan = (data: any): MembershipPlan => {
    let membershipPlan: MembershipPlan = {
        ...data,
        cost: parseCost(data.cost),
        startDate: data.startDate ? moment(data.startDate).toDate().toISOString() : data.startDate,
        endDate: data.endDate ? moment(data.endDate).toDate().toISOString() : data.endDate,
    };

    return membershipPlan;
}

export const serializeMembershipPlan = (membershipPlan: MembershipPlan): any => {
    return {
        ...membershipPlan,
        cost: serializeCost(membershipPlan.cost),
        startDate: membershipPlan.startDate ? moment(membershipPlan.startDate).startOf('day').toISOString() : membershipPlan.startDate,
        endDate: membershipPlan.endDate ? moment(membershipPlan.endDate).startOf('day').toISOString() : membershipPlan.endDate,
    };
}

export const newMembershipPlan = (): MembershipPlan => {
    let newMembershipPlan: MembershipPlan = {
        uuid: null,
        brandUuid: null,
        name: [],
        title: [],
        description: [],
        detail: [],
        numberOfClasses: 0,
        period: MembershipPlanPeriodEnum.classes,
        billingFrequency: BillingFrequencyEnum.oneTime,
        cost: {
            amount: 0,
            currency: newCurrency()
        },
        durationInMonths: 0,
        guestPrivilege: false,
        promotional: false,
        giftCard: false,
        includedCourses: [],
        includedGyms: [],
        startDate: moment().format("YYYY-MM-DD"),
        endDate: undefined,
        active: true,
        messages: [],
        createdBy: undefined,
        modifiedBy: undefined,
    };

    localesConfig.locales.forEach(l => {
        newMembershipPlan.name.push(newLocalizedString(l as LanguageEnum));
        newMembershipPlan.title.push(newLocalizedString(l as LanguageEnum));
        newMembershipPlan.description.push(newLocalizedString(l as LanguageEnum));
        newMembershipPlan.detail.push(newLocalizedString(l as LanguageEnum));
    });

    return newMembershipPlan;
}

export function getMembershipPlanName(membershipPlan: MembershipPlan, language?: LanguageEnum): string {

    let name = membershipPlan.name?.find(c => c.language === language);
    if (!name) {
        name = membershipPlan.name?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return name?.text ?? "";
}

export function getMembershipPlanPrice(membershipPlan: MembershipPlan, language?: LanguageEnum): string {

    let cost = parseCost(membershipPlan.cost);
    const amount = (cost.amount / 100).toFixed(2);
    return `${amount}${cost.currency.symbol} (${cost.currency.code})`;
}

export function getMembershipPlanDescription(membershipPlan: MembershipPlan, language?: LanguageEnum): string {

    let description = membershipPlan.description?.find(c => c.language === language);
    if (!description) {
        description = membershipPlan.description?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return description?.text ?? "";
}

export function getMembershipPlanTitle(membershipPlan: MembershipPlan, language?: LanguageEnum): string {

    let title = membershipPlan.title?.find(c => c.language === language);
    if (!title) {
        title = membershipPlan.title?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return title?.text ?? "";
}

export function getMembershipPlanDetail(membershipPlan: MembershipPlan, language?: LanguageEnum): string {

    let detail = membershipPlan.detail?.find(c => c.language === language);
    if (!detail) {
        detail = membershipPlan.detail?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return detail?.text ?? "";
}

export const MembershipPlanSchema = z.object({
    name: z.array(LocalizedStringSchema(true, "membershipPlan.validation.nameRequired")).min(2),
    description: z.array(LocalizedStringSchema(true, "membershipPlan.validation.descriptionRequired")).min(2),
    title: z.array(LocalizedStringSchema(true, "membershipPlan.validation.titleRequired")).min(2),
    numberOfClasses: z.coerce.number({ error: "validation.numericValue" })
        .gt(0, { error: "membershipPlan.validation.numberOfClassesRequired" })
        .int({ error: "validation.integerValue" }),
    period: z.enum(MembershipPlanPeriodEnum),
    billingFrequency: z.enum(BillingFrequencyEnum),
    cost: CostSchema,
    durationInMonths: z.coerce.number({ error: "validation.numericValue" })
        .gte(0, { error: "membershipPlan.validation.durationInMonthsInterval" })
        .lte(12, { error: "membershipPlan.validation.durationInMonthsInterval" })
        .int({ error: "validation.integerValue" }),
    guestPrivilege: z.boolean(),
    promotional: z.boolean(),
    giftCard: z.boolean(),
    includedGyms: z.array(GymReferenceSchema).min(0).nullable().optional(),
    includedCourses: z.array(CourseReferenceSchema).min(0).nullable().optional(),
    startDate: z.string().nullable().refine((date) => !!date, { message: "membershipPlan.validation.startDateRequired" }),
    endDate: z.string().nullable().optional(),
}).refine((membershipPlan) => membershipPlan.period !== MembershipPlanPeriodEnum.trial || membershipPlan.numberOfClasses == 1, {
    message: "membershipPlan.validation.onlyOneTrial",
    path: ["numberOfClasses"]
}).refine((membershipPlan) => !membershipPlan.endDate || !membershipPlan.startDate || (moment(membershipPlan.endDate).format("YYYYMMDD") >= moment(membershipPlan.startDate).format("YYYYMMDD")), {
    message: "membershipPlan.validation.endDateGreaterThanStartDate",
    path: ["endDate"], // path of error
}).refine((membershipPlan) => !membershipPlan.endDate || !membershipPlan.startDate || (moment(membershipPlan.endDate).format("YYYYMMDD") > moment().format("YYYYMMDD")), {
    message: "membershipPlan.validation.endDateGreaterThanToday",
    path: ["endDate"], // path of error;
});
