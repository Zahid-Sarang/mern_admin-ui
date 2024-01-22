export type Credentials = {
	email: string;
	password: string;
};

export type User = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	createdAt: string;
	tenant: Tenant | null;
};

export type CreateUserData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
	tenantId: number;
};

export type Tenant = {
	id?: number;
	address: string;
	name: string;
};

export type FiledData = {
	name: string;
	value?: string;
};
