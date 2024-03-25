import { AUTH_SERVICE } from "../constants";
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
