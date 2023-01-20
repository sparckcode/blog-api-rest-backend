const express = require('express');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

router.post('/create-article', ArticleController.saveArticle);
router.get('/get-articles/:last?', ArticleController.getAllArticles);
router.get('/get-article/:id', ArticleController.getArticle);
router.delete('/delete-article/:id', ArticleController.deleteArticle);
router.put('/update-article/:id', ArticleController.updateArticle);

module.exports = router;
