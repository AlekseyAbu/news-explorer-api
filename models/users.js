
const { Schema, model } = require('mongoose');
var validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            massage: 'email невалидный'
           }
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    }
})

module.exports = model('user', userSchema);