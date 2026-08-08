import { Cost, CostSchema, formatCost, parseCost, serializeCost } from "./finance/cost";
import { z } from 'zod';
import { BillingFrequencyEnum } from "./enum/billing-frequency-enum";
import { MembershipPlanPeriodEnum } from "./enum/membership-plan-period-enum";
import { LocalizedString, LocalizedStringSchema, newLocalizedString } from "./localized/localized-string";
import { BaseEntity } from "./entity/base-entity";
import { newCurrency } from "./finance/currency";
import { LanguageEnum } from "./enum/language-enum";
import { localesConfig } from "@/i18n/locales-client";
import moment from "moment";
import { LocaleTranslator } from "@/i18n/create-translators";

export interface MembershipPlan extends BaseEntity {
    uuid?: any;
    brandUuid?: any;
    name: LocalizedString[];
    title: LocalizedString[];
    description: LocalizedString[];
    termsOfUse: LocalizedString[];
    numberOfClasses: number;
    period: MembershipPlanPeriodEnum;
    billingFrequency: BillingFrequencyEnum;
    price: Cost;
    durationInMonths: number;
    guestPrivilege: boolean;
    promotional: boolean;
    giftCard: boolean;
    includedCourseUuids: string[];
    includedGymUuids: string[];
    startDate?: any;
    endDate?: any;
    active: boolean;
    activatedOn?: string;
    deactivatedOn?: string;
}

export const parseMembershipPlan = (data: any): MembershipPlan => {
    let membershipPlan: MembershipPlan = {
        ...data,
        price: parseCost(data.price),
        startDate: data.startDate ? moment(data.startDate).toDate().toISOString() : data.startDate,
        endDate: data.endDate ? moment(data.endDate).toDate().toISOString() : data.endDate,
    };

    return membershipPlan;
}

export const serializeMembershipPlan = (membershipPlan: MembershipPlan): any => {
    return {
        ...membershipPlan,
        price: serializeCost(membershipPlan.price),
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
        termsOfUse: [],
        numberOfClasses: 0,
        period: MembershipPlanPeriodEnum.classes,
        billingFrequency: BillingFrequencyEnum.oneTime,
        price: {
            amount: 0,
            currency: newCurrency()
        },
        durationInMonths: 0,
        guestPrivilege: false,
        promotional: false,
        giftCard: false,
        includedCourseUuids: [],
        includedGymUuids: [],
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
        newMembershipPlan.termsOfUse.push(newLocalizedString(l as LanguageEnum));
    });

    return newMembershipPlan;
}

export function getMembershipPlanName(membershipPlan: Partial<MembershipPlan>, language?: LanguageEnum): string {

    if (!membershipPlan.name) {
        return "";
    }

    let name = membershipPlan.name?.find(c => c.language === language);
    if (!name) {
        name = membershipPlan.name?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return name?.text ?? "";
}

export function getMembershipPlanPrice(membershipPlan: Partial<MembershipPlan>, showCurrency: boolean = true): string {
    return formatCost(membershipPlan.price, showCurrency);
}

export function getMembershipPlanDescription(membershipPlan: Partial<MembershipPlan>, language?: LanguageEnum): string {

    if (!membershipPlan.description) {
        return "";
    }

    let description = membershipPlan.description?.find(c => c.language === language);
    if (!description) {
        description = membershipPlan.description?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return description?.text ?? "";
}

export function getMembershipPlanTitle(membershipPlan: Partial<MembershipPlan>, language?: LanguageEnum): string {

    if (!membershipPlan.title) {
        return "";
    }

    let title = membershipPlan.title?.find(c => c.language === language);
    if (!title) {
        title = membershipPlan.title?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return title?.text ?? "";
}

export function getMembershipPlanTermsOfUse(membershipPlan: Partial<MembershipPlan>, language?: LanguageEnum): string {

    if (!membershipPlan.termsOfUse) {
        return "";
    }

    let detail = membershipPlan.termsOfUse?.find(c => c.language === language);
    if (!detail) {
        detail = membershipPlan.termsOfUse?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return detail?.text ?? "";
}

 /*function getMembershipPlanBilling(membershipPlan: MembershipPlan): string {
        return `${t(`membershipPlan.billingFrequency.descriptions.${membershipPlan.billingFrequency}`)}`;
}*/

/*export function getMembershipPlanOrderItemDescription(membershipPlan: MembershipPlan, language?: LanguageEnum): string {
                
                    {getMembershipPlanPrice(item.membershipPlan, lang as LanguageEnum)}  {getMembershipPlanBilling(item.membershipPlan)}
 
    let itemDescription = getMembershipPlanName(item.membershipPlan, lang as LanguageEnum) + " - " + getMembershipPlanPrice(item.membershipPlan, lang as LanguageEnum) + " - " + getMembershipPlanBilling(item.membershipPlan);
    if (!title) {
        title = membershipPlan.title?.find(c => c.language == localesConfig.defaultLocale as LanguageEnum);
    }

    return title?.text ?? "";
}*/

export const MembershipPlanSchema = z.object({
    name: z.array(LocalizedStringSchema(true, "membershipPlan.validation.nameRequired")).min(2),
    description: z.array(LocalizedStringSchema(true, "membershipPlan.validation.descriptionRequired")).min(2),
    termsOfUse: z.array(LocalizedStringSchema(true, "membershipPlan.validation.termsOfUseRequired")).min(2),
    title: z.array(LocalizedStringSchema(true, "membershipPlan.validation.titleRequired")).min(2),
    numberOfClasses: z.coerce.number({ error: "validation.numericValue" })
        .gt(0, { error: "membershipPlan.validation.numberOfClassesRequired" })
        .int({ error: "validation.integerValue" }),
    period: z.enum(MembershipPlanPeriodEnum),
    billingFrequency: z.enum(BillingFrequencyEnum),
    price: CostSchema,
    durationInMonths: z.coerce.number({ error: "validation.numericValue" })
        .gte(0, { error: "membershipPlan.validation.durationInMonthsInterval" })
        .lte(12, { error: "membershipPlan.validation.durationInMonthsInterval" })
        .int({ error: "validation.integerValue" }),
    guestPrivilege: z.boolean(),
    promotional: z.boolean(),
    giftCard: z.boolean(),
    includedGymUuids: z.array(z.string()).min(0).nullable().optional(),
    includedCourseUuids: z.array(z.string()).min(0).nullable().optional(),
    startDate: z.string().nullable().refine((date) => !!date, { message: "membershipPlan.validation.startDateRequired" }),
    endDate: z.string().nullable().optional(),
}).refine((membershipPlan) => !membershipPlan.endDate || !membershipPlan.startDate || (moment(membershipPlan.endDate).format("YYYYMMDD") >= moment(membershipPlan.startDate).format("YYYYMMDD")), {
    message: "membershipPlan.validation.endDateGreaterThanStartDate",
    path: ["endDate"], // path of error
}).refine((membershipPlan) => !membershipPlan.endDate || !membershipPlan.startDate || (moment(membershipPlan.endDate).format("YYYYMMDD") > moment().format("YYYYMMDD")), {
    message: "membershipPlan.validation.endDateGreaterThanToday",
    path: ["endDate"], // path of error;
});
