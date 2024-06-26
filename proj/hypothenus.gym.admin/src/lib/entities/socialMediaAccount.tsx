export interface SocialMediaAccount {
  accountName: string;
  url: string;
  socialMedia: SocialMediaTypeEnum;
}

export enum SocialMediaTypeEnum {
  Facebook,
  X,
  Instagram
}