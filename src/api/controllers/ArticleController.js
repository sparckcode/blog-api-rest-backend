const lodash = require('lodash');
const validator = require('validator');

const Article = require('../models/Article');

const saveArticle = (request, response) => {
    // Get params.
    let params = request.body;
    
    // Validate params.
    try {
        // Validate title.
        let validateTitle = !validator.isEmpty(params.title) &&
            validator.isLength(params.title, { min: 25, max: 100 });
        // Validate content.
        let validateContent = !validator.isEmpty(params.content);

        // Show error if validation is failed.
        if (!validateTitle || !validateContent) {
            throw new Error('Datos inválidos');
        }
    } catch (error) {
        return response.status(400).json({
            code: 400,
            message: error
        });
    }

    // Create article.
    const article = new Article(params);
    article.save((error, getArticle) => {
        if (error || lodash.isNil(getArticle)) {
            return response.status(400).json({
                code: 400,
                message: 'Error al guardar el artículo.'
            });
        }

        return response.status(200).json({
            code: 200,
            message: 'Artículo creado exitosamente.',
            article: getArticle
        });
    });
};

const getAllArticles = (request, response) => {
    let query = Article.find({});

    // Apply pagination.
    if (!lodash.isNil(request.params.last)) {
        query.limit(5);
    }

    query.sort({ created: 1}); // 1 = ASC | -1 = DESC
    query.exec((error, getArticles) => {
        if (error || lodash.isNil(getArticles)) {
            return response.status(400).json({
                code: 400,
                message: 'No se encontraron artículos.'
            });
        }

        return response.status(200).json({
            code: 200,
            message: 'Listado de artículos.',
            articles: getArticles
        });
    });
}

const getArticle = (request, response) => {
    // Get id.
    let idArticle = request.params.id;

    // Find and delete article.
    Article.findById(idArticle, (error, getArticle) => {
        if (error || lodash.isNil(getArticle)) {
            return response.status(400).json({
                code: 400,
                message: 'No se ha encontrado el artículo.'
            });
        }

        return response.status(200).json({
            code: 200,
            message: 'Artículo encontrado.',
            article: getArticle
        });
    });
}

const deleteArticle = (request, response) => {
    // Get id.
    let idArticle = request.params.id;

    // Find article.
    Article.findOneAndDelete({ _id: idArticle }, (error, deleteArticle) => {
        if (error || lodash.isNil(deleteArticle)) {
            return response.status(400).json({
                code: 400,
                message: 'No se ha encontrado el artículo que se desea borrar.'
            }); 
        }

        return response.status(200).json({
            code: 200,
            message: 'El artículo se eliminó correctamente.',
            articleDeleted: deleteArticle
        });
    });
};

const updateArticle = (request, response) => {
    // Get id.
    let idArticle = request.params.id;

    // Get new data to update.
    let params = request.body;

    // Validate data.
    try {
        // Validate title.
        let validateTitle = !validator.isEmpty(params.title) &&
            validator.isLength(params.title, { min: 25, max: 100 });
        // Validate content.
        let validateContent = !validator.isEmpty(params.content);

        // Show error if validation is failed.
        if (!validateTitle || !validateContent) {
            throw new Error('Datos inválidos');
        }
    } catch (error) {
        return response.status(400).json({
            code: 400,
            message: error
        });
    }

    // Find and update article.
    Article.findByIdAndUpdate({ _id: idArticle }, params, { new: true }, (error, articleUpdated) => {
        if (error || lodash.isNil(articleUpdated)) {
            return response.status(400).json({
                code: 400,
                message: 'No se pudo actualizar el artículo.'
            });
        }

        return response.status(200).json({
            code: 200,
            message: 'Artículo actualizado exitosamente.',
            articleUpdated: articleUpdated 
        });
    });
};

module.exports = {
    deleteArticle,
    getAllArticles,
    getArticle,
    saveArticle,
    updateArticle
}
