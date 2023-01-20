const lodash = require('lodash');
const fs = require('fs');

const Article = require('../models/Article');
const validateArticle = require('../helpers/article.validate');

const saveArticle = (request, response) => {
    // Get params.
    let params = request.body;
    
    // Validate data.
    try {
        validateArticle.validateArticle(params);   
    } catch (error) {
        return response.status(400).json({
            code: 400,
            message: 'Error: ' + error
        })
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
        validateArticle.validateArticle(params);   
    } catch (error) {
        return response.status(400).json({
            code: 400,
            message: 'Error: ' + error
        })
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

const uploadImg = (request, response) => {
    // Validate if comming an file.
    if (lodash.isNil(request.file) || lodash.isNil(request.files)) {
        return response.status(400).json({
            code: 400,
            message: 'No se cargó ningun archivo de imagen.'
        });
    }

    // Get name file.
    let fileName = request.file.originalname;

    // Get extension.
    let fileSplit = fileName.split('\.');
    let fileExtension = fileSplit[1];

    // Validate extension.
    if (!lodash.isEqual(fileExtension, "jpg") && !lodash.isEqual(fileExtension, "png") &&
        !lodash.isEqual(fileExtension, "jpeg") && !lodash.isEqual(fileExtension, "gif")) {
        // Delete file uploaded.
        fs.unlink(request.file.path, (error) => {
            return response.status(400).json({
                code: 400,
                message: 'El formato de la imagen no es válida.'
            });
        });
    } else {
        return response.status(200).json({
            code: 200,
            message: 'Imagen cargada exitosamente.',
            file: request.file
        });
    }
}

module.exports = {
    deleteArticle,
    getAllArticles,
    getArticle,
    saveArticle,
    updateArticle,
    uploadImg
}
