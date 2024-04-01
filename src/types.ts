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
	id: number;
	address: string;
	name: string;
};

export type FiledData = {
	name: string;
	value?: string;
};

export interface PriceConfiguration {
	[key: string]: {
		priceType: "base" | "aditional";
		availableOptions: string[];
	};
}

export interface Attributes {
	name: string;
	widgetType: "switch" | "radio";
	defaultValue: string;
	availableOptions: string[];
}

export interface Category {
	_id: string;
	name: string;
	priceConfiguration: PriceConfiguration;
	attributes: Attributes[];
}

export type Product = {
	_id: string;
	name: string;
	image: string;
	description: string;
	category: Category;
	isPublish: boolean;
	createdAt: string;
};
