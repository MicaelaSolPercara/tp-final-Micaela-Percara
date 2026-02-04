

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export const users: User[] = [];
