import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.SECRET_KEY; // Guarda la clave en una variable de entorno

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    if (!key) {
        throw new Error('SECRET_KEY environment variable is not set');
    }
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string) {
    if (!key) {
        throw new Error('SECRET_KEY environment variable is not set');
    }
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
