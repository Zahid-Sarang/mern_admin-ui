import { AUTH_SERVICE, CATALOG_SERVICE, ORDER_SERVICE } from "../constants";
import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials);
export const self = () => api.get(`${AUTH_SERVICE}/auth/self`);
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`);
export const getUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`);
export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createUser = (users: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, users);
export const createTenant = (tenants: Tenant) => api.post(`${AUTH_SERVICE}/tenants`, tenants);
export const updateUser = (user: CreateUserData, id: number) => api.patch(`${AUTH_SERVICE}/users/${id}`, user);
export const updateTenant = (tenant: Tenant, id: number) => api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant);

// Catalog Service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getCategory = (categpryId: string) => api.get(`${CATALOG_SERVICE}/categories/${categpryId}`);
export const getProducts = (queryParam: string) => api.get(`${CATALOG_SERVICE}/products?${queryParam}`);
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

// Order Services

export const getOrders = (queryString: string) => api.get(`${ORDER_SERVICE}/orders?${queryString}`);
