import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

// Auth Service
export const login = (credentials: Credentials) =>
	api.post("/auth/login", credentials);
export const self = () => api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getUsers = () => api.get("/users");
export const getTenants = () => api.get("/tenants");
export const createUser = (users: CreateUserData) => api.post("/users", users);
export const createTenant = (tenants: Tenant) => api.post("/tenants", tenants);
