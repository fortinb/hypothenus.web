import { MembershipPlan } from "../membership-plan";


export interface CartItem {
	membershipPlan: MembershipPlan;
	quantity: number;
	addedAt: string;
}

export interface Cart {
 	brandUuid?: any;
	memberUuid?: any;
	items: CartItem[];
}

export const newCart = (): Cart => {
  let newCart: Cart = {
	brandUuid: null,
	items: []
  };

  return newCart;
}

export const serializeCart = (cart: Cart): any => {
	return { ...cart };
}