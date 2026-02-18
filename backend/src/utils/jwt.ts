import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { TokenPayload } from '../types';

export const generateAccessToken = (userId: string, username: string, role: string): string => {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = {
    userId,
    username,
    role,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as TokenPayload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as { userId: string };
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
};
