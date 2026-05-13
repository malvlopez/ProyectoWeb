
//src/controllers/auth.controller.js

import { PrismaClient } from '../generated/prisma/index.js'; // Ajusta la ruta si es necesario
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { registerUser } from '../services/auth.service.js'; // Importa tu servicio
const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Usuario creado", token: user.verificationToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyAccount = async (req, res) => {
  const { token } = req.params;
  
  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return res.status(400).json({ message: "Token inválido" });

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, verificationToken: null }
  });

  res.json({ message: "Cuenta verificada con éxito" });
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  if (!user.isVerified) return res.status(401).json({ message: "Debes verificar tu cuenta primero" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

  // Aquí generas tu JWT (Token de sesión)
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { name: user.name, role: user.role } });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const rToken = crypto.randomBytes(32).toString('hex');
    
    // IMPORTANTE: Construimos el query como un string plano. 
    // Esto evita que Prisma intente crear un "prepared statement" con parámetros.
    const sql = `UPDATE "User" SET "resetToken" = '${rToken}' WHERE "email" = '${email}'`;

    await prisma.$executeRawUnsafe(sql);

    // Verificamos si se actualizó buscando al usuario
    const user = await prisma.user.findFirst({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ 
      message: "Token de recuperación generado con éxito", 
      resetToken: rToken 
    });
  } catch (error) {
    // Si el error s0 persiste, es que la sesión de red está "atrapada"
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // 1. Buscar al usuario que tenga ese token de recuperación
    const user = await prisma.user.findFirst({ where: { resetToken: token } });
    if (!user) return res.status(400).json({ message: "El token es inválido o ha expirado" });

    // 2. Hashear la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3. Actualizar contraseña y limpiar el token de recuperación
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetToken: null // Importante para que el token no se use dos veces
      }
    });

    res.json({ message: "Contraseña actualizada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};