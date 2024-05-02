const express = require('express');
const router = express.Router();
const {createCategory, getAllCategories, updateCategory} = require('../controllers/categoryController');
const passport = require("../utils/passport-configs");

// Rota para criar categoria
router.post('/categories', passport.authenticate('jwt', { session: false }),createCategory);

// Chama todas as categorias
router.get('/categories', getAllCategories )

router.put('/categories/:categoryId', passport.authenticate('jwt', { session: false }),updateCategory);

module.exports = router;