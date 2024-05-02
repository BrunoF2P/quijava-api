const express = require('express');
const router = express.Router();
const {createQuiz, getAllQuizzes, getQuizById, deleteQuiz, updateQuiz,} = require('../controllers/quizController');
const passport = require("../utils/passport-configs");

// Rota para criar o quiz
router.post('/quiz', passport.authenticate('jwt', { session: false }),createQuiz);
// Chama todos os quizes
router.get('/quiz', passport.authenticate('jwt', { session: false }),getAllQuizzes);
// Procura somente um quiz (por Id)
router.get('/quiz/:quizId', passport.authenticate('jwt', { session: false }), getQuizById,);
// Deleta um quiz (por Id)
router.delete('/quiz/:quizId', passport.authenticate('jwt', { session: false }),deleteQuiz);
// Atualiza  um quiz
router.put('/quiz/:quizId', passport.authenticate('jwt', { session: false }), updateQuiz);


module.exports = router;