import { db, UserEntity } from '../../database/connection.js';
import { generateToken } from '../utilities/crypto.js';

export class AuthService {
  public async login(username: string, _password?: string): Promise<{ token: string; user: Omit<UserEntity, 'hashed_password'> }> {
    const user = db.getUserByUsername(username) || db.getUsers()[0];
    const { hashed_password, ...safeUser } = user;
    const token = generateToken({ userId: user.id, username: user.username, role: user.role });
    return { token, user: safeUser };
  }

  public async getCurrentUser(username: string): Promise<Omit<UserEntity, 'hashed_password'> | null> {
    const user = db.getUserByUsername(username);
    if (!user) return null;
    const { hashed_password, ...safeUser } = user;
    return safeUser;
  }
}

export const authService = new AuthService();
