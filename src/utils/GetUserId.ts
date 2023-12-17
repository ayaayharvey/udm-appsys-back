import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
dotenv.config();

interface User {
    user_id: string,
    user_email: string,
}

export function getUserId (token: string): string {
    const secretKey = process.env.APP_SECRET_KEY;

    let decoded;
    let userId: string = '';

    if(token && secretKey) {
        decoded = jwt.verify(token, secretKey) as User;
        userId = decoded?.user_id
    }
    
    return userId;
}

export function getEmail (token: string): string {
    const secretKey = process.env.APP_SECRET_KEY;

    let decoded;
    let email: string = '';

    if(token && secretKey) {
        decoded = jwt.verify(token, secretKey) as User;
        email = decoded?.user_email 
    }
    
    return email;
}