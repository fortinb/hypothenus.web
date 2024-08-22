
export const DOMAIN_EXCEPTION_GYM_NOT_FOUND: string = "404";
export const DOMAIN_EXCEPTION_GYM_CODE_ALREADY_EXIST: string = "1001";
export const DOMAIN_EXCEPTION_COURSE_CODE_ALREADY_EXIST: string = "1002";

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