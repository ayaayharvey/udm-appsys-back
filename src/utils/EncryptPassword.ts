import crypto from 'crypto';

export function encryptPassword(password: string): string {
    const hashedPassword = crypto
        .createHash('MD5')
        .update(password)
        .digest('hex')

    return hashedPassword;
}