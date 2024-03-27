import { self } from "../http/api";
export const getSelf = async () => {
	const { data } = await self();
	return data;
};

export const USER_PER_PAGE = 8;
export const TENANT_PER_PAGE = 6;
export const PRODUCT_PER_PAGE = 6;

export const AUTH_SERVICE = "/api/auth";
export const CATALOGG_SERVICE = "/api/catalog";
