

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  roleId: number;
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  roleId?: number;
}

export const users: User[] = [];
