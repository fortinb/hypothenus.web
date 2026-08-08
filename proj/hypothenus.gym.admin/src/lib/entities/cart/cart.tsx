import { MembershipPlan } from "../membership-plan";


export interface CartItem {
	membershipPlan: MembershipPlan;
	quantity: number;
}

export interface Cart {
 	brandUuid?: any;
	memberUuid?: any;
	orderUuid?: any;
	items: CartItem[];
}

export const newCart = (): Cart => {
  let newCart: Cart = {
	brandUuid: null,
	memberUuid: null,
	orderUuid: null,
	items: []
  };

  return newCart;
}

export const serializeCart = (cart: Cart): any => {
	return { ...cart };
}