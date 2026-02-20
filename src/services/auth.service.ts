
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";import type { SignOptions } from "jsonwebtoken";
import type { User, CreateUserDTO } from "../models/users.model";
import { usersMysqlModel } from "../models/users.mysql.model";


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no definido");
}
const secretKey = process.env.JWT_SECRET as string;


const generateId = () => Date.now().toString();

export const authService = {
  findByEmail: async (email: string): Promise<User | null> => {
  return usersMysqlModel.findByEmail(email);
},

  register: async (data: CreateUserDTO): Promise<User> => {
  const existing = await usersMysqlModel.findByEmail(data.email);
  if (existing) {
    throw new Error("El email ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const roleId = data.roleId ?? 3;

  const newUser = await usersMysqlModel.create({
    name: data.name,
    email: data.email,
    passwordHash: hashedPassword,
    roleId,
  });

  return newUser;
},


  login: async (email: string, password: string): Promise<string> => {
  const invalidCredentialsError = new Error("Credenciales inválidas");

  const user = await usersMysqlModel.findByEmail(email);
  if (!user) throw invalidCredentialsError;

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw invalidCredentialsError;

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "1h",
    issuer: "curso-utn-backend",
  };

  return jwt.sign({ id: user.id, email: user.email, roleId: user.roleId }, secretKey, options);
},

}