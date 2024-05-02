const initModels = require('../models/init-models');
const sequelize = require("../config/db");

const models = initModels(sequelize)

// Função para criar um novo quiz
const createQuiz = async (req, res, next) => {
    const { title, description, categoryIds  } = req.body;

    // Verificar se o usuário está autenticado
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }

    // Obtendo o ID do usuário autenticado do Passport.js
    const authorId = req.user.userId;

    try {
        // Criar o quiz no banco de dados
        const newQuiz = await models.quizzes.create({
            title,
            description,
            authorId
        });

        if (categoryIds && categoryIds.length > 0) {
            // Encontrar as categorias no banco de dados com base nos IDs
            const categories = await models.categories.findAll({
                where: { categoryId: categoryIds }
            });
            // Verificar se foram encontradas categorias
            if (categories.length > 0) {
                // Associar as categorias ao quiz
                await Promise.all(categories.map(async (category) => {
                    await models.quizzes_categories.create({
                        quizId: newQuiz.quizId,
                        categoryId: category.categoryId
                    });
                }));
            }
        }

        return res.status(201).json({ success: true, quiz: newQuiz });
    } catch (error) {
        return next(error);
    }
};

const getAllQuizzes = async (req, res, next) => {
    try {
        // Obtenha o ID do usuário autenticado do objeto de solicitação (req.user)
        const userId = req.user.userId;

        // Busque todos os quizzes associados ao ID do usuário
        const userQuizzes = await models.quizzes.findAll({
            where: { authorId: userId },
            include: [{
                model: models.categories,
                as: 'categoryId_categories', // Especifique o alias 'categoryId_categories' para a associação
                through: { attributes: [] } // Isso evita que os atributos da tabela associativa sejam incluídos na resposta
            }]
        });

        // Retorne os quizzes encontrados como resposta
        return res.json({ success: true, quizzes: userQuizzes });
    } catch (error) {
        // Se ocorrer algum erro, repasse para o próximo middleware de erro
        return next(error);
    }
};

const getQuizById = async (req, res, next) => {
    try {
        // Obtenha o ID do usuário autenticado do objeto de solicitação
        const userId = req.user.userId;

        // Obtenha o ID do quiz da URL da solicitação
        const quizId = req.params.quizId;

        // Busque o quiz específico associado ao ID do usuário e ao ID do quiz
        const userQuiz = await models.quizzes.findOne({
            where: { authorId: userId, quizId: quizId },
            include: [{
                model: models.categories,
                as: 'categoryId_categories', // Corrija o alias para 'categoryId_categories'
                through: { attributes: [] } // Isso evita que os atributos da tabela associativa sejam incluídos na resposta
            }]
        });

        // Verifique se o quiz foi encontrado
        if (!userQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz não encontrado' });
        }

        // Retorne o quiz encontrado como resposta
        return res.json({ success: true, quiz: userQuiz });
    } catch (error) {
        // Se ocorrer algum erro, repasse para o próximo middleware de erro
        return next(error);
    }
};

const deleteQuiz = async (req, res, next) => {
    try {
        // Obtenha o ID do usuário autenticado do objeto de solicitação
        const userId = req.user.userId;

        // Obtenha o ID do quiz da URL da solicitação
        const quizId = req.params.quizId;

        // Verifique se o quiz pertence ao usuário autenticado
        const userQuiz = await models.quizzes.findOne({ where: { authorId: userId, quizId: quizId } });

        // Se o quiz não for encontrado, retorne uma resposta de erro
        if (!userQuiz) {
            return res.status(404).json({ success: false, message: 'Quiz não encontrado ou você não tem permissão para excluí-lo.' });
        }

        // Exclua as entradas na tabela de associação quizzes_categories
        await models.quizzes_categories.destroy({ where: { quizId: quizId } });

        // Exclua o quiz do banco de dados
        await models.quizzes.destroy({ where: { quizId: quizId } });

        // Retorne uma resposta de sucesso
        return res.status(204).json({ success: true, message: 'Quiz excluído com sucesso.' });
    } catch (error) {
        // Se ocorrer algum erro, repasse para o próximo middleware de erro
        return next(error);
    }
};

/** const updateQuiz = async (req, res, next) => {
    const {title_x, description_y} = req.body;

    try {
        // Obtenha o ID do usuário autenticado do objeto de solicitação
        const userId = req.user.userId;

        // Obtenha o ID do quiz da URL da solicitação
        const quizId = req.params.quizId;

        // Verifique se o quiz pertence ao usuário autenticado
        const quiz = await models.quizzes.findOne({ where: { authorId: userId, quizId } });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz não encontrado ou não pertence ao usuário' });
        }

        const title = models.quizzes.title
        const description = models.quizzes.description
        console.log(title_x)
        console.log(description_y)
        console.log(quizId)

        // Atualize os campos do quiz com os dados fornecidos na solicitação
        await models.quizzes.update({ title:title_x, description:description_y }, { where: { quizId } });

        // Busque novamente o quiz atualizado
        const updatedQuiz = await models.quizzes.findByPk(quizId);

        // Retorne o quiz atualizado como resposta
        return res.json({ success: true, quiz: updatedQuiz });
    } catch (error) {
        // Se ocorrer algum erro, repasse para o próximo middleware de erro
        return next(error);
    }
};
*/

const updateQuiz = async (req, res, next) => {
    const { title, description } = req.body;

    // Verificar se o usuário está autenticado
    if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    }

    try {
        // Obtenha o ID do usuário autenticado do objeto de solicitação
        const userId = req.user.userId;

        // Obtenha o ID do quiz da URL da solicitação
        const quizId = req.params.quizId;

        // Encontre o quiz associado ao ID do usuário e ao ID do quiz
        const quiz = await models.quizzes.findOne({ where: { authorId: userId, quizId } });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz não encontrado ou não pertence ao usuário' });
        }

        // Atualizar apenas os campos que foram fornecidos na solicitação
        if (title) {
            quiz.title = title;
        }
        if (description) {
            quiz.description = description;
        }

        // Salvar o quiz atualizado no banco de dados
        await quiz.save();

        // Retornar o quiz atualizado como resposta
        return res.json({ success: true, quiz });
    } catch (error) {
        return next(error);
    }
};


module.exports = { createQuiz, getAllQuizzes, getQuizById, deleteQuiz, updateQuiz, };
