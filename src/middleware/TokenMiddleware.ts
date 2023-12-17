import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// replace with actual secret key.
const secretKey = process.env.APP_SECRET_KEY;

export const generateTemporaryToken = (user_id: number, user_email: string, user_role: string): string => {
    if (!secretKey) {
        throw new Error ('missing secret key');
    }
    return jwt.sign({user_id, user_email, user_role},secretKey, {expiresIn: 15 * 60});
}

export const generateToken = (user_id: number, user_email: string, user_role: string): string => {
    if (!secretKey) {
        throw new Error ('missing secret key');
    }
    
    return jwt.sign({user_id, user_email, user_role},secretKey);
}

export const generateResetToken = (user_email: string): string => {
    if (!secretKey) {
        throw new Error ('missing secret key');
    }
    
    return jwt.sign({user_email}, secretKey, {expiresIn: 15 * 60});
}