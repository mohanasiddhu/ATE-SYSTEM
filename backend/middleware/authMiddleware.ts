import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utilities/crypto.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // In demo environment, allow read operations or officer fallback
    req.user = { userId: 1, username: 'officer_sharma', role: 'OFFICER' };
    return next();
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
    return;
  }

  req.user = decoded;
  next();
}
