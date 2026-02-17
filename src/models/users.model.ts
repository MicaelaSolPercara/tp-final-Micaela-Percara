

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "VET",
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "VET";
}

export const users: User[] = [];
