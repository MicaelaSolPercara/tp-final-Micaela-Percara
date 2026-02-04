
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";import type { SignOptions } from "jsonwebtoken";
import { users, User, CreateUserDTO } from "../models/users.model";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}
const secretKey = process.env.JWT_SECRET as string;


const generateId = () => Date.now().toString();

export const authService = {
  findByEmail: (email: string): User | undefined => {
    return users.find((u) => u.email === email);
  },

  register: async (data: CreateUserDTO): Promise<User> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);
    return newUser;
  },

  login: async (email: string, password: string): Promise<string> => {
    const invalidCredentialsError = new Error("Credenciales inválidas");

    const user = users.find((u) => u.email === email);
    if (!user) throw invalidCredentialsError;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw invalidCredentialsError;

    const options: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1h",
  issuer: "curso-utn-backend",
};


return jwt.sign({ id: user.id, email: user.email }, secretKey, options);
  },
};

