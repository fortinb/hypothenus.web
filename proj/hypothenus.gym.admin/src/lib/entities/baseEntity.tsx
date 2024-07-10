import { Message } from "./messages";

export interface BaseEntity {
    messages: Message[] | null | undefined;
    createdBy: string | null | undefined;
    modifiedBy: string | null | undefined;
  }