
export const DOMAIN_EXCEPTION_GYM_NOT_FOUND: string = "404";
export const DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST: string = "1001";
export const DOMAIN_EXCEPTION_MEMBER_ALREADY_EXIST: string = "1001";
export const DOMAIN_EXCEPTION_USER_ALREADY_EXIST: string = "1001";
export const DOMAIN_EXCEPTION_USER_ROLE_ASSIGNMENT_NOT_ALLOWED: string = "1002";
export const DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST: string = "1002";
export const DOMAIN_EXCEPTION_BRAND_CODE_ALREADY_EXIST: string = "2001";

export enum MessageSeverityEnum {
  Info = "Info",
  Warning = "Warning",
  Error = "Error",
  Critical = "Critical",
}

export interface Message {
  code: string;
  description: string;
  severity: MessageSeverityEnum;
}