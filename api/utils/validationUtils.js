// validationUtils.js
const validateInput = (username, password) => {
    // Verifica se os campos estão vazios
    if (!username || !password) {
        return { valid: false, message: 'Nome de usuário e senha são obrigatórios' };
    }

    // Verifica se a senha tem mais de 8 caracteres
    if (password.length < 8) {
        return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
    }

    // Verifica se o nome de usuário segue o padrão de letras e números
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return { valid: false, message: 'O nome de usuário deve conter apenas letras e números' };
    }

    return { valid: true };
};

module.exports = { validateInput };