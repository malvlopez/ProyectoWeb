//src/services/auth.service.js
import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const vToken = crypto.randomBytes(32).toString('hex'); 

  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      verificationToken: vToken,
      role: userData.role || 'STUDENT'
    }
  });
};