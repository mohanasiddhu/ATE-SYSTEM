import { Request, Response } from 'express';
import { authService } from '../services/authService.js';

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username || 'officer_sharma', password);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getCurrentUserHandler(req: Request, res: Response): Promise<void> {
  try {
    const username = (req as any).user?.username || 'officer_sharma';
    const user = await authService.getCurrentUser(username);
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
