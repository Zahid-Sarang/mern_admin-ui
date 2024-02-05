import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) =>
	api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = (queryString: string) =>
	api.get(`/users?${queryString}`);
export const getTenants = (queryString: string) =>
	api.get(`/tenants?${queryString}`);
export const createUser = (users: CreateUserData) => api.post("/users", users);
export const createTenant = (tenants: Tenant) => api.post("/tenants", tenants);
export const updateUser = (user: CreateUserData, id: number) =>
	api.patch(`/users/${id}`, user);
