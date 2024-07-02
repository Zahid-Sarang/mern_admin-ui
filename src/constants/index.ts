import { self } from "../http/api";
export const getSelf = async () => {
	const { data } = await self();
	return data;
};

export const USER_PER_PAGE = 8;
export const TENANT_PER_PAGE = 6;
export const PRODUCT_PER_PAGE = 6;
export const TOPPING_PER_PAGE = 6;
export const COUPON_PER_PAGE = 6;

export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";
export const ORDER_SERVICE = "/api/order";

export const colorMapping = {
	received: "processing",
	confirmed: "orange",
	prepared: "volcano",
	out_for_delivery: "purple",
	delivered: "success",
};
