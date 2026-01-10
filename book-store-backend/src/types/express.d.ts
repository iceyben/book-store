import { UserRole } from "./common.type";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        isActive: boolean;
      };
    }
  }
}

export {};
