const initModels = require("../models/init-models");
const sequelize = require("../config/db");


const models = initModels(sequelize)

const createCategory = async (req, res, next) => {
    const { description } = req.body;

    // Verificar se o usuário está autenticado
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }
    const user_id = req.user.user_id;

    try {

        // Verificar se o usuário tem permissão para criar categorias
        if (user_id !== 1) {

            return res.status(403).json({ success: false, message: 'Permissão negada para criar categorias' });
        }

        // Validar a descrição da categoria
        if (!description || !/^[a-zA-Z0-9 ]+$/.test(description)) {
            return res.status(400).json({ success: false, message: 'A descrição da categoria não pode ser nula e não pode conter caracteres especiais' });
        }

        // Verificar se a descrição da categoria já existe
        const existingCategory = await models.categories.findOne({ where: { description } });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Uma categoria com essa descrição já existe' });
        }

        // Criar a categoria no banco de dados
        const category = await models.categories.create({ description });

        // Retornar a categoria criada
        return res.status(201).json({ success: true, category });
    } catch (error) {
        return next(error);
    }
};


module.exports = { createCategory };