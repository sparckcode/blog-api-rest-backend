const validator = require('validator');

const validateArticle = (params) => {
    // Validate title.
    let validateTitle = !validator.isEmpty(params.title) &&
        validator.isLength(params.title, { min: 25, max: 100 });
    // Validate content.
    let validateContent = !validator.isEmpty(params.content);

    // Show error if validation is failed.
    if (!validateTitle || !validateContent) {
        throw new Error('Datos inválidos');
    }
}

module.exports = {
    validateArticle
}