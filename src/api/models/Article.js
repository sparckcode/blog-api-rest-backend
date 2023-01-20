const { Schema, model } = require('mongoose');

const ArticleSchema = Schema({
    title: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: "default.jpg"
    }
});

module.exports = model("Article", ArticleSchema, "articles");
