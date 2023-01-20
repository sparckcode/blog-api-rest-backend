const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

router.post('/create-article', ArticleController.saveArticle);
router.get('/get-articles/:last?', ArticleController.getAllArticles);
router.get('/get-article/:id', ArticleController.getArticle);

module.exports = router;
