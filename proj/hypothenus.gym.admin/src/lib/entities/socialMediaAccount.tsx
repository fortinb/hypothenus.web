export interface SocialMediaAccount {
  accountName: string;
  url: string;
  socialMedia: SocialMediaTypeEnum | null;
}

export enum SocialMediaTypeEnum {
  Facebook,
  X,
  Instagram
}

export const newSocialMediaAccount = (): SocialMediaAccount => {
  let newSocialMediaAccount: SocialMediaAccount = {
    accountName: "",
    url: "",
    socialMedia: null
  };

  return newSocialMediaAccount;
} 