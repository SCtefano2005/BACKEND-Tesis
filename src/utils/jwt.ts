import jwt, { SignOptions, Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'dev_secret';

export const generarToken = (
  payload: object,
  expiresIn: string | number = '1d'
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'] // ✅ aquí el cast explícito
  };
  return jwt.sign(payload, JWT_SECRET, options);
};
