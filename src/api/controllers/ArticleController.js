const lodash = require('lodash');
const fs = require('fs');
const path = require('path');

const Article = require('../models/Article');
const validateArticle = require('../helpers/article.validate');

/**
 * @description Method to create an article.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
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

/**
 * @description Method list all articles.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
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

/**
 * @description Method to get a article.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
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

/**
 * @description Method to delete an article.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
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

/**
 * @description Method to update an article.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
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

/**
 * @description Method to upload an image to article.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
const uploadImg = (request, response) => {
    // Validate if comming an file.
    if (lodash.isNil(request.file) && lodash.isNil(request.files)) {
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
        // Get id.
        let idArticle = request.params.id;

        // Find and update article.
        Article.findByIdAndUpdate({ _id: idArticle }, { image: request.file.filename }, { new: true }, (error, articleUpdated) => {
            if (error || lodash.isNil(articleUpdated)) {
                return response.status(400).json({
                    code: 400,
                    message: 'No se pudo actualizar el artículo.'
                });
            }

            return response.status(200).json({
                code: 200,
                message: 'Artículo actualizado exitosamente.',
                articleUpdated: articleUpdated,
                file: request.file
            });
        });
    }
}

/**
 * @description Method to show a image.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
const getImage = (request, response) => {
    // Get file name to search.
    let file = request.params.file;
    // Set path file.
    let filePath = './src/assets/image-articles/' + file;

    // Validate if file exists.
    fs.access(filePath, (exists) => {
        if (lodash.isNil(exists)) {
            return response.sendFile(path.resolve(filePath));
        } else {
            return response.status(400).json({
                code: 400,
                message: 'No se encontró la imagen.'
            });
        }
    })
};

/**
 * @description Method to get articles using a searcher.
 * @param {any} request 
 * @param {any} response 
 * @returns {Object}
 */
const searcher = (request, response) => {
    // Get string to search.
    let search = request.params.str;

    // Searching.
    Article.find({"$or": [
        {"title": {"$regex": search, "$options": "i"}},
        {"content": {"$regex": search, "$options": "i"}},
    ]})
    .sort({created: -1})
    .exec((error, getArticles) => {
        if (error || lodash.isEmpty(getArticles)) {
            return response.status(404).json({
                code: 404,
                message: 'No se encontró ningún artículo con la búsqueda: ' + search
            });
        }

        return response.status(200).json({
            code: 200,
            message: 'Lista de artículos buscados.',
            articles: getArticles
        });
    });
};

module.exports = {
    deleteArticle,
    getAllArticles,
    getArticle,
    getImage,
    saveArticle,
    updateArticle,
    uploadImg,
    searcher
}
