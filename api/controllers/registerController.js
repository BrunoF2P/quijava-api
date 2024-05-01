const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sequelize = require("../config/db.js");
const initModels = require("../models/init-models");
const { validateInput } = require("../utils/validationUtils");
const jwtConfig = require("../config/jwtConfig");
const models = initModels(sequelize)


const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Valida os campos de entrada
    const validation = validateInput(username, password);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Verifica se o nome de usuário já está em uso
        const existingUser = await models.users.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já em uso' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const user = await models.users.create({ username, password: hashedPassword });

        // Gerar token JWT
        const payload = {username: user.username.trim(), user_id: user.user_id };

        const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn, algorithm: jwtConfig.algorithm });

        res.json({ success: true, message: 'Usuario cadastrado', token });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Falha ao cadastrar' });
    }
};

module.exports = { registerUser };