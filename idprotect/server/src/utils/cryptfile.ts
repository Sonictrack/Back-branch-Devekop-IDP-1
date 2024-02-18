import crypto from 'crypto'

const algorithm = 'aes-256-ctr';

const key = crypto.createHash('sha256').update(String(process.env.CRYPTO_SECRET_KEY)).digest('base64').substr(0, 32);
const iv = crypto.createHash('sha256').update(String(process.env.CRYPTO_SECRET_IV)).digest('base64').substr(0, 16);

function encrypt(buffer: Buffer) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return crypted;
};

function decrypt(buffer: Buffer) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
};

export { encrypt, decrypt }