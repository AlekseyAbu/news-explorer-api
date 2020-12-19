const { Schema, model } = require('mongoose');
var validator = require('validator');

const articleSchema = new Schema({
    keyword: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator(v) {
              return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: 'URL не подходит',
          },
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(v) {
              return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
            },
            message: 'URL не подходит',
          },
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
})

module.exports = model('article', articleSchema);