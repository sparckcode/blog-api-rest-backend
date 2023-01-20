const express = require('express');
const multer = require('multer');
const router = express.Router();

const ArticleController = require('../controllers/ArticleController');

// Create storage.
const pathToSaveImg = './src/assets/image-articles/';
const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, pathToSaveImg);
    },
    filename: function (request, file, cb) {
        cb(null, 'article' + Date.now() + file.originalname);
    }
});

const uploaded = multer({ storage: storage });

router.post('/create-article', ArticleController.saveArticle);
router.get('/get-articles/:last?', ArticleController.getAllArticles);
router.get('/get-article/:id', ArticleController.getArticle);
router.delete('/delete-article/:id', ArticleController.deleteArticle);
router.put('/update-article/:id', ArticleController.updateArticle);
router.post('/upload-image/:id', [uploaded.single('file')], ArticleController.uploadImg);

module.exports = router;
