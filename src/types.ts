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
};

export type Tenant = {
	id: number;
	address: string;
	name: string;
};
