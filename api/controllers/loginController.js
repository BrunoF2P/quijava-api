const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require("../config/db.js");
const initModels = require("../models/init-models");
const jwtConfig = require("../config/jwtConfig");
const {validateInput} = require("../utils/validationUtils");

const models = initModels(sequelize);

const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    // Valida os campos de entrada
    const validation = validateInput(username, password);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Verifica se o usuário existe no banco de dados
        const user = await models.users.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Gera o token JWT
        const payload = { username: user.username, id: user.userId };

        const token = jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn, algorithm: jwtConfig.algorithm });

        // Retorna o token
        return res.status(200).json({ token });
    } catch (error) {
        return next(error);
    }
};

module.exports = { loginUser };
