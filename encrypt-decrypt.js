const crypto = require('crypto');
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
global.encryptData = function (text) {
    try {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return (true, encrypted)
    } catch (err) {
        return ({ status: false, data: err })
    }
},

    global.decryptData = function (text) {
        try {
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return { status: true, data: decrypted };
        } catch (error) {
            console.error('Decryption error:', error.message);
            return { status: false, error: error.message };
        }
    }
