export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        roleId?: number;
        username?: string;
      };
    }
  }
}

