import { AUTH_SERVICE, CATALOG_SERVICE, ORDER_SERVICE } from "../constants";
import { Coupon, CreateUserData, Credentials, OrderStatus, Tenant } from "../types";
import { api } from "./client";

/**
 * Auth Service Endpoints
 */
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (users: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, users);
export const createTenant = (tenants: Tenant) => api.post(`${AUTH_SERVICE}/tenants`, tenants);
export const updateUser = (user: CreateUserData, id: number) => api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const updateTenant = (tenant: Tenant, id: number) => api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

/**
 * Catalog Service Endpoints
 */
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getCategory = (categpryId: string) => api.get(`${CATALOG_SERVICE}/categories/${categpryId}`);
export const getProducts = (queryParam: string) => api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
export const getToppings = (queryParam: string) => api.get(`${CATALOG_SERVICE}/toppings?${queryParam}`);
export const deleteTopping = (toppingId: string) => api.delete(`${CATALOG_SERVICE}/toppings/${toppingId}`);
export const createProduct = (product: FormData) =>
	api.post(`${CATALOG_SERVICE}/products`, product, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
export const updateProduct = (product: FormData, productId: string) =>
	api.put(`${CATALOG_SERVICE}/products/${productId}`, product, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const createTopping = (topping: FormData) =>
	api.post(`${CATALOG_SERVICE}/toppings`, topping, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const updateTopping = (topping: FormData, toppingId: string) =>
	api.put(`${CATALOG_SERVICE}/toppings/${toppingId}`, topping, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

/**
 * Order Service Endpoints
 */
export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`);
export const getSingle = (orderId: string, queryString: string) =>
	api.get(`${ORDER_SERVICE}/orders/${orderId}?${queryString}`);
export const changeStatus = (orderId: string, data: { status: OrderStatus }) =>
	api.patch(`${ORDER_SERVICE}/orders/change-status/${orderId}`, data);
export const getCoupons = (queryString: string) => api.get(`${ORDER_SERVICE}/coupons?${queryString}`);
export const createCoupons = (couponData: Coupon) => api.post(`${ORDER_SERVICE}/coupons`, couponData);
