export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface JwtPayload {
  id: number;
  role: UserRole;
}
