// src/types/userTypes

export type User = {
	id: number;
	fullName: string;
	email: string;
	createdAt: string;
	updatedAt: string;
};

export type NewUser = Omit<User, "id" | "createdAt" | "updatedAt"> & {
	password: string;
};
